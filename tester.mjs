"use strict";

import { CDServiceProxy as CDService } from "./cd-service.mjs";
import { CD } from "./cd.mjs"

const cdService = new CDService()

const cds = await cdService.getAll()
let id = 0;
if (cds) {
    console.log("Found CDs:")
    for (let cd of cds) {
        id = Math.max(id, cd.id)
        console.log(`${cd.id}: ${JSON.stringify(cd)}`)
    }
}

let cd = new CD(id + 1, "Blockbuster Hits", "Red Box", 12, 19.99);
console.log(`cd is an instance of CD: ${cd instanceof CD}`)

id = await cdService.create(cd)

cd = await cdService.getByID(1)

console.log(`Fetch CD #1: ${JSON.stringify(cd)}`)

cd.title = cd.title + " - revised"
cd.id = undefined

console.log(`Creating a new cd: ${JSON.stringify(cd)}`)

id = await cdService.create(cd)

cd.id = id
cd.title = cd.title.replace("revised", "redux")

console.log(`Updating CD #${cd.id}: ${JSON.stringify(cd)}`)

await cdService.update(cd)

cd = await cdService.getByID(id)

console.log(`Fetched to verify CD #${cd.id}: ${JSON.stringify(cd)}`)

await cdService.delete(cd)
