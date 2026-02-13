import express from "express";

import { AllResumes, OneResume } from "./data.mjs";

export const router = express.Router();

// Routing for our resume API
// http://localhost:3000/api/resumes
router.get("/", (req, res) => { res.json(AllResumes()); });
// http://localhost:3000/api/resumes/bob
router.get("/:id", (req, res) => { res.json(OneResume(req.params['id'])); });
