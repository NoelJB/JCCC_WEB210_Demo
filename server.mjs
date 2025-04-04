import express from "express";
import path from "path";

import  { router as cd_routes } from "./controllers/cd_api.mjs"

const app = express();
const port = 3000;
const __dirname = import.meta.dirname;

app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const router = express.Router()

router.use("/cds", cd_routes)

app.use("/", router)

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
}

// Register our shutdown hook for SIGTERM and SIGINT
process.on('SIGTERM', shutdown)
process.on("SIGINT", shutdown)
