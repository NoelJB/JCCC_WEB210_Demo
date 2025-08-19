"use strict";

import * as dotenv from "dotenv"
dotenv.config()
const CD_IN_MONGODB_DEBUG = process.env.CD_IN_MONGODB_DEBUG != "false"
const CD_IN_MONGDB_URL = process.env.CD_IN_MONGDB_URL || "mongodb://localhost:27017"
const CD_DB_NAME = process.env.CD_DB_NAME || 'simons_seaside_db'
const CD_COLLECTION_NAME = process.env.CD_COLLECTION_NAME || "cds"
const COUNTERS_COLLECTION_NAME = process.env.COUNTERS_COLLECTION_NAME || "counters"
const CD_COUNTER_NAME = process.env.CD_COUNTER_NAME || "cd_counter"

import { MongoClient, ReturnDocument } from 'mongodb';

const client = new MongoClient(CD_IN_MONGDB_URL);

import { CDServiceAbstract } from "./cd-service.mjs"
import { CD } from "./cd.mjs"
import { assert } from "node:console";

export class CDServiceMongoDB extends CDServiceAbstract {
    #client; #collection; #counters;

    constructor() {
        super()

        // register a shutdown hook to run on process exit so that we can persist.  Write
        // the file on shutdown.  if we wanted to switch to async I/O, we'd have to use
        // beforeExit, not exit.
        process.on('exit', () => {
            if (CD_IN_MONGODB_DEBUG) console.info(`Process exit received. Closing connection to ${CD_IN_MONGDB_URL}.`);
            this.#client.close()
        });
    }

    async #connect() {
        if (!this.#client) {
            this.#client = new MongoClient(CD_IN_MONGDB_URL);
            await this.#client.connect();
            const db = this.#client.db(CD_DB_NAME)

            this.#collection = db.collection(CD_COLLECTION_NAME)
            this.#counters = db.collection(COUNTERS_COLLECTION_NAME)
            const cd_counter = await this.#counters.findOne({_id: CD_COUNTER_NAME})
            if (CD_IN_MONGODB_DEBUG) console.log(`Counter record: ${JSON.stringify(cd_counter)}`)
            if (!cd_counter) {
                await this.#counters.insertOne({_id: CD_COUNTER_NAME, sequence: 0})
            }
        }
    }

    async #nextId() {
        const { sequence } = await this.#counters.findOneAndUpdate(
            { _id: CD_COUNTER_NAME },
            { $inc: { sequence: 1 } },
            { returnDocument: "after" }
        )
        return sequence
    }

    #makeDocument(dest, src) { // Neither Object.assign nor spread operator are copying our enumerable properties
        for (const p in src) {
            dest[p] = src[p]
        }
        return dest
    }

    async getAll() {
        await this.#connect()
        return await this.#collection.find({}).project({_id: 0}).map(cd => CD.attachType(cd)).toArray()
    }

    async getByID(id) {
        await this.#connect()
        id = parseInt(id)
        const cd = await this.#collection.findOne({_id: id}, {projection: {_id: 0}})
        return cd ? CD.attachType(cd) : cd
    }

    async create(cd) {
        await this.#connect()
        CD.attachType(cd)
        cd.id = await this.#nextId();
        const { insertedId } = await this.#collection.insertOne(this.#makeDocument({_id: cd.id}, cd))
        assert(cd.id === insertedId)
        if (CD_IN_MONGODB_DEBUG) console.log(`Created CD #${insertedId}`)
        return insertedId
    }

    async update(cd) {
        await this.#connect
        CD.attachType(cd)
        const updateResult = await this.#collection.replaceOne({_id: cd.id}, this.#makeDocument({_id: cd.id}, cd))
        if (CD_IN_MONGODB_DEBUG) console.log(updateResult)
        return updateResult.modifiedCount === 1 // return True if the updated changed a row, else False (should mean NOT FOUND)
    }

    async delete(id) {
        await this.#collection.deleteOne({_id: id})
    }
}

import { fileURLToPath } from "node:url";
if (fileURLToPath(import.meta.url) === process.argv[1]) {
    const cdService = new CDServiceMongoDB()
    
    const cds = await cdService.getAll()
    if (cds.length !== 0) {
        console.log("Found CDs:")
        for (let cd of cds) {
            console.log(JSON.stringify(cd))
        }
    } else {
        console.log("No CDS")

        const preload = [
            { 
              "title": "Journey to the Centre of the Earth",
              "artist": "Rick Wakeman",
              "tracks": 4,
              "price": 6.98
            },
            {
              "title": "Tapestry (1999 Reissue)",
              "artist": "Carole King",
              "tracks": 14,
              "price": 7.98
            },
            {
              "title": "Wilson Phillips",
              "artist": "Wilson Phillips",
              "tracks": 10,
              "price": 15.00
            }
          ]
          
          // forEach will start all of these in parallel; map() lets us start them and wait for the entire loop to finish.
          // Without this, the Blockbuster Hits CD can be created before some of these.
          await Promise.all(preload.map(async (e) => {
             const cd = new CD(undefined, e.title, e.artist, e.tracks, e.price)
             console.log(`Storing ${JSON.stringify(cd)}`)
             const id = await cdService.create(cd)
             console.log(`Created CD ${id}: ${JSON.stringify(cd)}`)
          }))
    }

    let cd = new CD(undefined, "Blockbuster Hits", "Red Box", 12, 19.99);
    console.log(`Storing ${JSON.stringify(cd)}`)
    const id = await cdService.create(cd)
    cd = await cdService.getByID(id)
    console.log(`Fetched newly created CD #${id}: ${JSON.stringify(cd)}`)

    cd.id = undefined
    cd.title = cd.title + " - revised"
    
    console.log(`Creating a new cd: ${JSON.stringify(cd)}`)
    cd.id = await cdService.create(cd)
    
    cd.title = cd.title.replace("revised", "redux")
    console.log(`Updating CD #${cd.id}: ${JSON.stringify(cd)}`)
    assert(true === await cdService.update(cd))
    
    cd = await cdService.getByID(cd.id)
    console.log(`Fetched to verify CD #${cd.id}: ${JSON.stringify(cd)}`)
    
    await cdService.delete(id)
    await cdService.delete(cd.id)

    assert(! await cdService.getByID(id))
    assert(false === await cdService.update(cd))

    process.exit(0);
}
