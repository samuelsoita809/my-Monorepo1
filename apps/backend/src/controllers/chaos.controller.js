import { EVENTS, createLogSignal } from "@inventory/shared";

let failureMode = false;

export const ChaosController = {
    toggle(req, res) {
        failureMode = req.body.enabled ?? !failureMode;

        console.warn(createLogSignal(EVENTS.ABUSE_TRIGGERED, {
            action: "CHAOS_MODE_TOGGLE",
            enabled: failureMode,
            timestamp: new Date().toISOString()
        }));

        res.json({ failureMode });
    },

    getMode(req, res) {
        res.json({ failureMode });
    }
};

// Middleware to inject chaos
export const chaosMiddleware = (req, res, next) => {
    if (failureMode && Math.random() > 0.7) {
        const error = new Error("Simulated System Failure (Chaos Engineering)");
        return next(error);
    }
    next();
};
