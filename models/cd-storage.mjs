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
            this.#cds = JSON.parse(readFileSync(CD_IN_MEMORY_FILE, 'utf8')).filter(e => e).map(cd => CD.attachType(cd));
            this.#nextID = Math.max(...(this.#cds.map(cd => cd.id))) + 1
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
        return this.#cds
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
    	const index = this.#cds.findIndex(e => {
	  if (!e) return false
	  return e.id === cd.id
	})
        if (index >= 0) this.#cds[index] = cd
        return this.#cds[index]
    }

    async delete(id) { // expects an ID, not a CD
    	const index = this.#cds.findIndex(e => {
	  if (!e) return false
	  return e.id === parseInt(id)
	})
        if (index >= 0) this.#cds.splice(index, 1);
    }
}
