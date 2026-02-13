import express from "express";

import { ResumeServiceInMemory as ResumeService } from "../models/resume-service-in-memory.mjs";

const resumeRepository = new ResumeService()

export const router = express.Router();

// Routing for our resume API
// http://localhost:3000/api/resumes
router.get("/", async (req, res) => { res.json(await resumeRepository.getAll()); });
// http://localhost:3000/api/resumes/bob
router.get("/:id", async (req, res) => { res.json(await resumeRepository.getByID(req.params['id'])); });
