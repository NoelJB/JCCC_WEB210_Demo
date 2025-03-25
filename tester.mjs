"use strict";

let res = await fetch("http://localhost:3000/cds/1")
let cd = await res.json()
console.log(cd)

cd.title = cd.title + " - revised"
cd.id = undefined

console.log(cd)

res = await fetch("http://localhost:3000/cds", {
    method: "POST", // Specify request method
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cd)
})

console.log(res)