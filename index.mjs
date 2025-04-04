"use strict";

import express from "express";

import { CDServiceInMemory as CDService } from "./cd-service.mjs";
import { CD } from "./cd.mjs";


const port = 3000;
const app = express();
app.use(express.json());

const cdRepository = new CDService()

app.post('/cds', async (req, res) => {
    // Logic to create a new item and get its ID (e.g., from a database)
    const cd = req.body;
    const id = await cdRepository.create(cd)

    // Construct the URL for the new item
    const newItemUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}/${id}`;

    // Set the Location header and send the 201 status code
    res.location(newItemUrl).status(201).send();
    console.log(`Created ${newItemUrl}`)
});

app.put('/cds/:cd_id', async (req, res) => {
    const id = req.params['cd_id']
    console.log(`Request to update CD #${id}`)
    const result = await cdRepository.update(req.body)
    if (result) {
        res.status(204).send()
    }
    else res.status(404).send()
})

app.delete('/cds/:cd_id', async (req, res) => {
    const id = req.params['cd_id']
    console.log(`Request to delete CD #${id}`)
    cdRepository.delete(id)
    res.status(204).send()
})

app.get('/cds/:cd_id', async (req, res) => {
    const id = req.params['cd_id']
    // console.log(`Request for CD #${id}`)
    const cd = await cdRepository.getByID(id)
    if (cd) res.json(cd)
    else res.status(404).send()
})

app.get('/cds', async (req, res) => {
    // console.log(await cdRepository.getAll())
    res.json(await cdRepository.getAll())
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

// A shutdown hook.  Please note that process.exit causes any "exit" hooks to run.
const shutdown = () => {
    console.info('Shutdown signal received.');
    console.log('Closing http server.');
    server.close(() => {
        console.log('Express HTTP server closed.');
        process.exit(0);
    });
}

// Register our shutdown hook for SIGTERM and SIGINT
process.on('SIGTERM', shutdown)
process.on("SIGINT", shutdown)
