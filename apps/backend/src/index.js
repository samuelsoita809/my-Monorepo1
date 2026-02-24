import "./env.js";
import express from "express";
import cors from "cors";
import { initializeDatabase } from "./db/init.js";
import { analyticsMiddleware } from "./middleware/analytics.middleware.js";
import { EVENTS, createLogSignal } from "@inventory/shared";
import healthRoutes from "./routes/health.routes.js";
import productRoutes from "./routes/product.routes.js";

import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3001;
const apiVersion = process.env.API_VERSION || 'v1';

app.use(cors());
app.use(express.json());
app.use(analyticsMiddleware);

// Standardized Route Mounting
const apiRouter = express.Router();
apiRouter.use('/health', healthRoutes);
apiRouter.use('/products', productRoutes);

app.use(`/api/${apiVersion}`, apiRouter);

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error(createLogSignal(EVENTS.REQUEST_ERROR, {
    path: req.path,
    method: req.method,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  }));

  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    signal: EVENTS.REQUEST_ERROR
  });
});

const startServer = async () => {
  try {
    // Initialize DB with connection guard
    await initializeDatabase();

    app.listen(port, () => {
      console.log(createLogSignal(EVENTS.BOOT_SUCCESS, { port, version: apiVersion }));
    });
  } catch (error) {
    console.error(createLogSignal(EVENTS.BOOT_FAILURE, { error: error.message }));
    // Still start server but in degraded mode if DB fails (to avoid process crash)
    app.listen(port, () => {
      console.log(createLogSignal(EVENTS.BOOT_SUCCESS, { port, mode: 'DEGRADED_DB_OFFLINE' }));
    });
  }
};

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  startServer();
}

export default app;
