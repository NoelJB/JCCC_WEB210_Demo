"use strict";

import { CD } from "./cd.mjs"


export class CDServiceAbstract {
    constructor() {
        if (new.target === CDServiceAbstract) {
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

    async delete(id) {
        throw new Error(`${this.delete.name} is not implemented in ${this.constructor.name}`)
    }
}
