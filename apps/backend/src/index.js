import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeDatabase } from "./db/init.js";
import { analyticsMiddleware } from "./middleware/analytics.middleware.js";
import { EVENTS, createLogSignal } from "@inventory/shared";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables based on NODE_ENV
const envPath = join(__dirname, '..', `.env.${process.env.NODE_ENV || 'development'}`);
dotenv.config({ path: envPath });

import healthRoutes from "./routes/health.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();
const port = process.env.PORT || 3001;
const apiVersion = process.env.API_VERSION || 'v1';

app.use(cors());
app.use(express.json());
app.use(analyticsMiddleware);

// Mount routes
app.use(`/api/${apiVersion}/health`, healthRoutes);
app.use(`/api/${apiVersion}/products`, productRoutes);

const isMain = process.argv[1] === __filename;
if (isMain) {
  // Initialize DB Foundation ONLY when running as entry point
  initializeDatabase();

  app.listen(port, () => {
    console.log(createLogSignal(EVENTS.BOOT_SUCCESS, { port, version: apiVersion }));
  });
}

export default app;
