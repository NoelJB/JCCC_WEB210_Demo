import * as dotenv from "dotenv"
dotenv.config()
const CD_PROXY_DEBUG = process.env.CD_PROXY_DEBUG != "false"
const CD_IN_MEMORY_DEBUG = process.env.CD_IN_MEMORY_DEBUG != "false"
const CD_IN_MEMORY_FILE = process.env.CD_IN_MEMORY_FILE || "cd_repository.json"

import { existsSync, readFileSync, writeFileSync } from "node:fs"

import { CD } from "./cd.mjs"


class CDServiceAbstract {
    constructor() {
        if (new.target == CDServiceAbstract) {
            throw new Error("Cannot Instantiate CDServiceAbstract")
        }
    }

    async getAll() {
        throw new Error(`${this.getAll.name} is not implemented in ${this.constructor.name}`)
    }

    async getByID(id) {
        throw new Error(`${this.getByID.name} is not implemented in ${this.constructor.name}`)
    }

    async create(cd) {
        throw new Error(`${this.create.name} is not implemented in ${this.constructor.name}`)
    }

    async update(cd) {
        throw new Error(`${this.update.name} is not implemented in ${this.constructor.name}`)
    }

    async delete(cd) {
        throw new Error(`${this.delete.name} is not implemented in ${this.constructor.name}`)
    }
}


export class CDServiceProxy extends CDServiceAbstract {
    // ES2022 private fields
    #uri;

    constructor(uri) {
        super()
        this.#uri = uri || process.env.CD_BASE_URI
    }

    async getAll() {
        const res = await fetch(this.#uri)
        const cds = (await res.json()).map(cd => CD.fromJSON(cd))
        if (CD_PROXY_DEBUG) console.log(cds)
        return cds
    }

    async getByID(id) {
        const res = await fetch(`${this.#uri}/${id}`)
        const cd = (res.status == 200) ? CD.fromJSON(await res.json()) : undefined;
        return cd
    }

    static #extractID(response) {
        const path = response.headers.get("Location")
        if (!path) throw new Error("POST without Location header! Open a bug report.")
        const segments = path.split("/")
        return parseInt(segments.at(-1))
    }

    async create(cd) {
        const res = await fetch(this.#uri, {
            method: "POST", // Specify request method
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cd)
        })

        if (CD_PROXY_DEBUG) console.log(res)

        return CDServiceProxy.#extractID(res)
    }

    async update(cd) {
        const res = await fetch(`${this.#uri}/${cd.id}`, {
            method: "PUT", // Specify request method
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cd)
        })

        if (CD_PROXY_DEBUG) console.log(res)
    }

    async delete(cd) {
        const res = await fetch(`${this.#uri}/${cd.id}`, {
            method: "DELETE" // Specify request method
        })

        if (CD_PROXY_DEBUG) console.log(res)
    }
}


export class CDServiceInMemory extends CDServiceAbstract {
    #cds; #nextID;

    constructor() {
        super()

        // Database?  We don't need no database!
        // if we have a persistent store, load it now.
        if (existsSync(CD_IN_MEMORY_FILE)) {
            this.#cds = JSON.parse(readFileSync(CD_IN_MEMORY_FILE, 'utf8')).filter(e => e).map(cd => CD.fromJSON(cd));
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
        return this.#cds.filter(e => e)
    }

    async getByID(id) {
        return this.#cds[id]
    }

    async create(cd) {
        cd.id = this.#nextID++
        if (CD_IN_MEMORY_DEBUG) console.log(`Creating ${JSON.stringify(cd)} (${cd instanceof CD})`)
        this.#cds[cd.id] = CD.fromJSON(cd)
        if (CD_IN_MEMORY_DEBUG) console.log(`Created ${JSON.stringify(this.#cds[cd.id])} (${this.#cds[cd.id] instanceof CD})`)
        return cd.id
    }

    async update(cd) {
        if (this.#cds[cd.id]) {
            this.#cds[cd.id] = CD.fromJSON(cd)
        }
        return this.#cds[cd.id]
    }

    async delete(id) { // expects an ID, not a CD
        if (this.#cds[id]) this.#cds.splice(id, 1);
    }
}
