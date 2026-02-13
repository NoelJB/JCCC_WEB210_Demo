export class ResumeServiceAbstract {
    constructor() {
        if (new.target === ResumeServiceAbstract) {
            throw new Error("Cannot Instantiate ResumeServiceAbstract")
        }
    }

    async getAll() {
        throw new Error(`${this.getAll.name} is not implemented in ${this.constructor.name}`)
    }

    async getByID(id) {
        throw new Error(`${this.getByID.name} is not implemented in ${this.constructor.name}`)
    }

    async create(resume) {
        throw new Error(`${this.create.name} is not implemented in ${this.constructor.name}`)
    }

    async update(resume) {
        throw new Error(`${this.update.name} is not implemented in ${this.constructor.name}`)
    }

    async delete(id) {
        throw new Error(`${this.delete.name} is not implemented in ${this.constructor.name}`)
    }
}
