"use strict";

import * as dotenv from "dotenv"
dotenv.config()
const CD_IN_SQLITE_DEBUG = process.env.CD_IN_SQLITE_DEBUG != "false"
const CD_IN_SQLITE_FILE = process.env.CD_IN_SQLITE_FILE || "cd_repository.db"

import { existsSync } from "node:fs"
import { DatabaseSync } from 'node:sqlite';

import { CDServiceAbstract } from "./cd-service.mjs"
import { CD } from "./cd.mjs"
import { assert } from "node:console";

export class CDServiceSQLite extends CDServiceAbstract {
    #db; #getAll_statement; #getByID_statement; #create_statement; #update_statement; #delete_statement;

    constructor() {
        super()

        if (!existsSync(CD_IN_SQLITE_FILE)) {
            this.#db = new DatabaseSync(CD_IN_SQLITE_FILE)
            // See https://sqlite.org/autoinc.html for why we don't need AUTOINCREMENT
            this.#db.exec(`
                CREATE TABLE CDS(
                    id INTEGER PRIMARY KEY,
                    title TEXT,
                    artist TEXT,
                    tracks INTEGER,
                    price REAL
                )
            `)
            if (CD_IN_SQLITE_DEBUG) console.log(`Created ${CD_IN_SQLITE_FILE}.`)
        } else {
            this.#db = new DatabaseSync(CD_IN_SQLITE_FILE)
        }

        // register a shutdown hook to run on process exit so that we can persist.  Write
        // the file on shutdown.  if we wanted to switch to async I/O, we'd have to use
        // beforeExit, not exit.
        process.on('exit', () => {
            if (CD_IN_SQLITE_DEBUG) console.info(`Process exit received. Closing connection to ${CD_IN_SQLITE_FILE}.`);
            this.#db.close()
        });

        // prepare statements
        this.#getAll_statement = this.#db.prepare('SELECT * FROM CDS')
        this.#getByID_statement = this.#db.prepare('SELECT * FROM CDS WHERE ID = ?')
        this.#create_statement = this.#db.prepare(`INSERT INTO CDS(title, artist, tracks, price) VALUES(?, ?, ?, ?)`)
        this.#update_statement = this.#db.prepare("UPDATE CDS SET title = ?, artist = ?, tracks = ?, price = ? WHERE id = ?")
        this.#delete_statement = this.#db.prepare("DELETE FROM CDS WHERE id = ?")
    }

    async getAll() {
        return this.#getAll_statement.all().map(cd => CD.attachType(cd))
    }

    async getByID(id) {
        id = parseInt(id)
        const cd = this.#getByID_statement.get(id)
        return cd ? CD.attachType(cd) : cd
    }

    async create(cd) {
        CD.attachType(cd)
        const { changes, lastInsertRowid } = this.#create_statement.run(cd.title, cd.artist, cd.tracks, cd.price)
        assert(changes === 1)
        if (CD_IN_SQLITE_DEBUG) console.log(`Created CD #${lastInsertRowid}`)
        return lastInsertRowid
    }

    async update(cd) {
        CD.attachType(cd)
        const { changes, lastInsertRowid } = this.#update_statement.run(cd.title, cd.artist, cd.tracks, cd.price, cd.id)
        return changes === 1  // return True if the updated changed a row, else False (should mean NOT FOUND)
    }

    async delete(id) {
        this.#delete_statement.run(id)
    }
}

import { fileURLToPath } from "node:url";
if (fileURLToPath(import.meta.url) === process.argv[1]) {
    const cdService = new CDServiceSQLite()
    
    const cds = await cdService.getAll()
    if (cds.length !== 0) {
        console.log("Found CDs:")
        for (let cd of cds) {
            console.log(JSON.stringify(cd))
        }
    } else {
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
          
          preload.forEach(async (e) => {
             const cd = new CD(undefined, e.title, e.artist, e.tracks, e.price)
             const id = await cdService.create(cd)
          })
    }
    
    let cd = new CD(undefined, "Blockbuster Hits", "Red Box", 12, 19.99);
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

    assert(undefined === await cdService.getByID(id))
    assert(false === await cdService.update(cd))
}
