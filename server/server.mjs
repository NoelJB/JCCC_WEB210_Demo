import * as dotenv from "dotenv"
dotenv.config()

const CD_BASE_URI = process.env.CD_BASE_URI || "http://localhost:3000/api/cds"

import express from "express";
import path from "path";

import { router as cd_routes } from "./controllers/cd_api.mjs"

const app = express();
const port = 3000;
const __dirname = import.meta.dirname;

app.set("view engine", "ejs")

app.use(express.json());

// Routing for our React UI
app.use('/react', express.static(path.join(__dirname, '../react-ui/build')));

// Routing for our plain HTML/CSS/JS UI
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/models', express.static(path.join(__dirname, 'models')));

// Routing for our CD REST API
app.use("/api/cds", cd_routes)

// Routing for our app page
app.use("/", (req,res) => {
    res.render("app", {
	base_uri: CD_BASE_URI
    })
})

app.use((req, res, next) => {
    res.status(404).send('Sorry, the file you requested was not found.');
});

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

    // Close any lingering (KEEP-ALIVE?) connections after the timeout
    setTimeout(() => {
	console.log('Forcefully closing connections...');
	server.closeAllConnections();
    }, 5000); // Timeout after 5 seconds
}

// Register our shutdown hook for SIGTERM and SIGINT
process.on('SIGTERM', shutdown)
process.on("SIGINT", shutdown)
