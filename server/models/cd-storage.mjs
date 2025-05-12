"use strict";

import * as dotenv from "dotenv"
dotenv.config()
const CD_IN_MEMORY_DEBUG = process.env.CD_IN_MEMORY_DEBUG != "false"
const CD_IN_MEMORY_FILE = process.env.CD_IN_MEMORY_FILE || "cd_repository.json"

import { existsSync, readFileSync, writeFileSync } from "node:fs"

import { CDServiceAbstract } from "./cd-service.mjs"
import { CD } from "./cd.mjs"

export class CDServiceInMemory extends CDServiceAbstract {
    #cds; #nextID;

    constructor() {
        super()

        // Database?  We don't need no database!
        // if we have a persistent store, load it now.
        if (existsSync(CD_IN_MEMORY_FILE)) {
            // we're first going to read into an array, then reassign into #cds, keeping it SPARSE and index aligned.
            // filter(e => e) eliminates potentially empty entries
            const cds = JSON.parse(readFileSync(CD_IN_MEMORY_FILE, 'utf8')).filter(e => e).map(cd => CD.attachType(cd));
            this.#cds = []
            cds.forEach(cd => this.#cds[cd.id] = cd)
            this.#nextID = this.#cds.length
            if (CD_IN_MEMORY_DEBUG) console.log(`Loaded ${this.#cds.length} CDs.  Next id is ${this.#nextID}.`)
        } else {
            this.#cds = new Array()
            this.#nextID = 0;
        }

        // register a shutdown hook to run on process exit so that we can persist.  Write
        // the file on shutdown.  if we wanted to switch to async I/O, we'd have to use
        // beforeExit, not exit.
        process.on('exit', () => {
            if (CD_IN_MEMORY_DEBUG) console.info('Process exit received. Persisting CD repository.');
            writeFileSync(CD_IN_MEMORY_FILE, JSON.stringify(this.#cds), "utf8")
        });
    }

    async getAll() {
        // #cds is sparse.  Return a contigous array.
        return this.#cds.filter(e => e)
    }

    async getByID(id) {
        id = parseInt(id)
        return this.#cds.filter(e => e.id === id)[0]
    }

    async create(cd) {
        cd.id = this.#nextID++
        CD.attachType(cd)
        if (CD_IN_MEMORY_DEBUG) console.log(`Creating ${JSON.stringify(cd)} (${cd instanceof CD})`)
        this.#cds[cd.id] = cd
        if (CD_IN_MEMORY_DEBUG) console.log(`Created ${JSON.stringify(this.#cds[cd.id])} (${this.#cds[cd.id] instanceof CD})`)
        return cd.id
    }

    async update(cd) {
        CD.attachType(cd)
        this.#cds[cd.id] = cd
        return cd
    }

    async delete(id) {
        if (this.#cds[id]) this.#cds.splice(id, 1);
    }
}
