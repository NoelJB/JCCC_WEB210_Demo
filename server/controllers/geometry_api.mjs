import express from "express";

export const router = express.Router();

// Routing for our circle API
// http://localhost:3000/api/math/circle?radius=16 => { area: 804, circumference: 100.5 }
// area: Math.PI * radius * radius
// circ: 2 * Math.PI * radius
router.get("/circle", (req, res) => {
    const radius = req.query.radius;
    res.json({ area: Math.PI * radius * radius, circumference: 2 * Math.PI * radius })
});

// http://localhost:3000/api/math/square?side=10 => { square: 100 }
router.get("/square", (req, res) => {
    const side = req.query.side;
    res.json({ square: side * side })
});