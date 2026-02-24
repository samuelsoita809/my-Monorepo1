import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { EVENTS, createLogSignal } from "@inventory/shared";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables based on NODE_ENV
const envPath = join(__dirname, '..', `.env.${process.env.NODE_ENV || 'development'}`);
dotenv.config({ path: envPath });

const app = express();
const port = process.env.PORT || 3001;
const apiVersion = process.env.API_VERSION || 'v1';

app.use(cors());
app.use(express.json());

app.get(`/api/${apiVersion}/health`, (req, res) => {
  if (process.env.LOG_LEVEL === 'debug') {
    console.log(createLogSignal(EVENTS.REQUEST_RECEIVED, { path: req.path, env: process.env.NODE_ENV }));
  }
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    signal: EVENTS.REQUEST_SUCCESS,
    environment: process.env.NODE_ENV
  });
});

const isMain = process.argv[1] === __filename;
if (isMain) {
  app.listen(port, () => {
    console.log(`[${new Date().toISOString()}] BACKEND_STARTED on port ${port}`);
  });
}

export default app;
