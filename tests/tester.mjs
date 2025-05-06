"use strict";

import * as dotenv from "dotenv"
dotenv.config()

const CD_BASE_URI = process.env.CD_BASE_URI || "http://localhost:3000/api/cds"

import { CDServiceProxy as CDService } from "../models/cd-proxy.mjs";
import { CD } from "../models/cd.mjs"

const cdService = new CDService(CD_BASE_URI)

const cds = await cdService.getAll()
if (cds.length !== 0) {
    console.log("Found CDs:")
    for (let cd of cds) {
        console.log(JSON.stringify(cd))
    }
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
await cdService.update(cd)

cd = await cdService.getByID(cd.id)
console.log(`Fetched to verify CD #${cd.id}: ${JSON.stringify(cd)}`)

await cdService.delete(cd)
