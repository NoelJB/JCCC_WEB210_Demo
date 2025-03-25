"use strict";

import express from "express";
import { CD } from "./cd.mjs";

const port = 3000;
const app = express();
app.use(express.json());

const cd = new CD(1, "Blockbuster Hits", "Red Box", 12, 19.99);
console.log(`cd is an instance of CD: ${cd instanceof CD}`)
const cd_str = JSON.stringify(cd)
console.log(cd_str)
console.log(JSON.parse(cd_str))

var nextID = cd.id

app.post('/cds', (req, res) => {
    // Logic to create a new item and get its ID (e.g., from a database)
    const data = req.body;
    console.log(`Received ${data}`)
    const newCD = new CD(++nextID, data.title, data.artist, data.tracks, data.price)

    // Construct the URL for the new item
    const newItemUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}/${newCD.id}`;

    // Set the Location header and send the 201 status code
    res.location(newItemUrl).status(201).send();
    console.log(`Created ${newItemUrl}`)
});

app.get('/cds/:cd_id', (req, res) => {
    console.log("Got a CD request")
    res.json(cd)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
