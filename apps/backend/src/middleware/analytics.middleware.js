import { db } from "../db/db.js";
import { analyticsEvents } from "../db/schema.js";
import { EVENTS, createLogSignal } from "@inventory/shared";

/**
 * Middleware to track request lifecycle events as analytics signal.
 * Emits: REQUEST_RECEIVED, REQUEST_SUCCESS, REQUEST_ERROR
 */
export const analyticsMiddleware = async (req, res, next) => {
    const start = Date.now();

    // 1. Emit REQUEST_RECEIVED
    try {
        if (process.env.NODE_ENV !== 'test') {
            await db.insert(analyticsEvents).values({
                signal: EVENTS.REQUEST_RECEIVED,
                action: `${req.method} ${req.path}`,
                payload: {
                    ip: req.ip,
                    userAgent: req.get('user-agent'),
                    query: req.query
                },
                timestamp: new Date()
            });
        }
    } catch (err) {
        if (process.env.NODE_ENV !== 'test') {
            console.error("Failed to log REQUEST_RECEIVED analytics", err);
        }
    }

    // Hook into response finish to track success/error
    res.on('finish', async () => {
        const latency = Date.now() - start;
        const signal = res.statusCode >= 400 ? EVENTS.REQUEST_ERROR : EVENTS.REQUEST_SUCCESS;

        try {
            if (process.env.NODE_ENV !== 'test') {
                await db.insert(analyticsEvents).values({
                    signal,
                    action: `${req.method} ${req.path}`,
                    payload: {
                        statusCode: res.statusCode,
                        method: req.method,
                        path: req.path
                    },
                    latency,
                    timestamp: new Date()
                });
            }

            // Also log to console for visibility (except in tests to keep output clean)
            if (process.env.NODE_ENV !== 'test') {
                console.log(createLogSignal(signal, {
                    path: req.path,
                    statusCode: res.statusCode,
                    latency: `${latency}ms`
                }));
            }
        } catch (err) {
            if (process.env.NODE_ENV !== 'test') {
                console.error("Failed to log post-request analytics", err);
            }
        }
    });

    next();
};
