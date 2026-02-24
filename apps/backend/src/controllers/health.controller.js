import { EVENTS, createLogSignal } from "@inventory/shared";

export const getHealth = (req, res) => {
    if (process.env.LOG_LEVEL === 'debug') {
        console.log(createLogSignal(EVENTS.REQUEST_RECEIVED, { path: req.path, env: process.env.NODE_ENV }));
    }
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        signal: EVENTS.REQUEST_SUCCESS,
        environment: process.env.NODE_ENV
    });
};
