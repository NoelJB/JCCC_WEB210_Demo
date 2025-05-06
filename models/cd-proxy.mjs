"use strict";

import { CDServiceAbstract } from "./cd-service.mjs"
import { CD } from "./cd.mjs"

const CD_PROXY_DEBUG=false

export class CDServiceProxy extends CDServiceAbstract {
    // ES2022 private fields
    #uri;

    constructor(uri) {
        super()
        this.#uri = uri
    }

    async getAll() {
        const res = await fetch(this.#uri)
        const cds = (await res.json()).map(cd => CD.attachType(cd))
        if (CD_PROXY_DEBUG) console.log(cds)
        return cds
    }

    async getByID(id) {
        const res = await fetch(`${this.#uri}/${id}`)
        const cd = (res.status == 200) ? CD.attachType(await res.json()) : undefined;
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

    async delete(id) {
        const res = await fetch(`${this.#uri}/${id}`, {
            method: "DELETE" // Specify request method
        })

        if (CD_PROXY_DEBUG) console.log(res)
    }
}
