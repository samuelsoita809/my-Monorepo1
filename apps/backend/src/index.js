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

import healthRoutes from "./routes/health.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";

const app = express();
const port = process.env.PORT || 3001;
const apiVersion = process.env.API_VERSION || 'v1';

app.use(cors());
app.use(express.json());

// Routes
app.use(`/api/${apiVersion}`, healthRoutes);
app.use(`/api/${apiVersion}/inventory`, inventoryRoutes);

const isMain = process.argv[1] === __filename;
if (isMain) {
  app.listen(port, () => {
    console.log(`[${new Date().toISOString()}] BACKEND_STARTED on port ${port}`);
  });
}

export default app;
