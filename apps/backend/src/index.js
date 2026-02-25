import "./env.js";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { initializeDatabase } from "./db/init.js";
import { analyticsMiddleware } from "./middleware/analytics.middleware.js";
import { EVENTS, createLogSignal } from "@inventory/shared";
import healthRoutes from "./routes/health.routes.js";
import productRoutes from "./routes/product.routes.js";
import chaosRoutes from "./routes/chaos.routes.js";
import { chaosMiddleware } from "./controllers/chaos.controller.js";

import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3001;
const apiVersion = process.env.API_VERSION || 'v1';

// Security: Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later",
  handler: (req, res, _next, options) => {
    console.warn(createLogSignal(EVENTS.ABUSE_TRIGGERED, {
      reason: "GLOBAL_RATE_LIMIT",
      ip: req.ip,
      path: req.path
    }));
    res.status(options.statusCode).send(options.message);
  }
});

// Security: Strict Limiter for Write Operations
const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 product registrations per minute
  handler: (req, res, _next, options) => {
    console.warn(createLogSignal(EVENTS.ABUSE_TRIGGERED, {
      reason: "WRITE_RATE_LIMIT",
      ip: req.ip,
      path: req.path
    }));
    res.status(options.statusCode).send(options.message);
  }
});

app.use(globalLimiter);
app.use(cors());
app.use(express.json());
app.use(analyticsMiddleware);
app.use(chaosMiddleware);

// Standardized Route Mounting
const apiRouter = express.Router();
apiRouter.use('/health', healthRoutes);
apiRouter.use('/products', writeLimiter, productRoutes);
apiRouter.use('/chaos', chaosRoutes);

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
