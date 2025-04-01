import * as dotenv from "dotenv"
dotenv.config()
const CD_PROXY_DEBUG = process.env.CD_PROXY_DEBUG != "false"


import { CD } from "./cd.mjs"


class CDServiceAbstract{
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
        if (CD_PROXY_DEBUG) console.log(cd)
        return cds
    }

    async getByID(id) {
        const res = await fetch(`${this.#uri}/${id}`)
        if (CD_PROXY_DEBUG) console.log(res)
        const cd = (res.status == 200) ? CD.fromJSON(await res.json()) : undefined;
        if (CD_PROXY_DEBUG) console.log(cd)
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
    constructor() {
        super()
    }
}
