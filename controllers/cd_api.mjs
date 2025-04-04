"use strict";

import express from "express";

import { CDServiceInMemory as CDService } from "../models/cd-service.mjs";
import { CD } from "../models/cd.mjs";

export const router = express.Router();

const cdRepository = new CDService()

router.post('/', async (req, res) => {
    // Logic to create a new item and get its ID (e.g., from a database)
    const cd = req.body;
    const id = await cdRepository.create(cd)

    // Construct the URL for the new item
    const newItemUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}/${id}`;

    // Set the Location header and send the 201 status code
    res.location(newItemUrl).status(201).send();
    console.log(`Created ${newItemUrl}`)
});

router.put('/:cd_id', async (req, res) => {
    const id = req.params['cd_id']
    console.log(`Request to update CD #${id}`)
    const result = await cdRepository.update(req.body)
    if (result) {
        res.status(204).send()
    }
    else res.status(404).send()
})

router.delete('/:cd_id', async (req, res) => {
    const id = req.params['cd_id']
    console.log(`Request to delete CD #${id}`)
    cdRepository.delete(id)
    res.status(204).send()
})

router.get('/:cd_id', async (req, res) => {
    const id = req.params['cd_id']
    // console.log(`Request for CD #${id}`)
    const cd = await cdRepository.getByID(id)
    if (cd) res.json(cd)
    else res.status(404).send()
})

router.get('/', async (req, res) => {
    // console.log(await cdRepository.getAll())
    res.json(await cdRepository.getAll())
})
