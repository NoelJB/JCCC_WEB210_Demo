"use strict";

import express from "express";
import { CD } from "./cd.mjs";

const port = 3000;
const app = express();
app.use(express.json());

// Database?  We don't need no database!
const cds = new Array()

var nextID = 0

app.post('/cds', (req, res) => {
    // Logic to create a new item and get its ID (e.g., from a database)
    const data = req.body;
    console.log(`Received ${JSON.stringify(data)}`)
    const newCD = new CD(++nextID, data.title, data.artist, data.tracks, data.price)

    cds[newCD.id] = newCD

    // Construct the URL for the new item
    const newItemUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}/${newCD.id}`;

    // Set the Location header and send the 201 status code
    res.location(newItemUrl).status(201).send();
    console.log(`Created ${newItemUrl}`)
});

app.put('/cds/:cd_id', (req, res) => {
    const id = req.params['cd_id']
    console.log(`Request to update CD #${id}`)
    if (cds[id]) { 
        const data = req.body;
        cds[id] = new CD(id, data.title, data.artist, data.tracks, data.price)
        res.status(204).send()
    }
    else res.status(404).send()
})

app.delete('/cds/:cd_id', (req, res) => {
    const id = req.params['cd_id']
    console.log(`Request to delete CD #${id}`)
    if (cds[id]) cds.splice(id, 1);
    res.status(204).send()
})

app.get('/cds/:cd_id', (req, res) => {
    const id = req.params['cd_id']
    console.log(`Request for CD #${id}`)
    if (cds[id]) res.json(cds[id])
    else res.status(404).send()
})

app.get('/cds', (req, res) => {
    console.log("Got a CDs request")
    res.json(cds.filter(e => e))
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
