"use strict";

async function getCD(id)
{
    const res = await fetch(`http://localhost:3000/cds/${id}`)
    const cd = await res.json()
    console.log(cd)
    return cd
}

function extractID(response) {
    const path = response.headers.get("Location")
    if (!path) throw new Error("POST without Location header! Open a bug report.")
    const segments = path.split("/")
    return parseInt(segments.at(-1))
}

async function createCD(cd) {
    const res = await fetch("http://localhost:3000/cds", {
        method: "POST", // Specify request method
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cd)
    })

    console.log(res)

    return extractID(res)
}

async function updateCD(cd) {
    const res = await fetch(`http://localhost:3000/cds/${cd.id}`, {
        method: "PUT", // Specify request method
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cd)
    })
    
    console.log(res)
}

async function deleteCD(cd) {
    const res = await fetch(`http://localhost:3000/cds/${cd.id}`, {
        method: "DELETE" // Specify request method
    })
    
    console.log(res)    
}

let cd = await getCD(1)

cd.title = cd.title + " - revised"
cd.id = undefined

console.log(cd)

let id = await createCD(cd)

cd.id = id
cd.title = cd.title.replace("revised", "redux")

await updateCD(cd)
await deleteCD(cd)
