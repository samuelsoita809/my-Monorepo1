import { db } from "./db.js";
import { messages } from "./schema.js";
import { EVENTS, createLogSignal } from "@inventory/shared";

/**
 * Foundation Level 1: Verify database connection and seed initial message
 */
export const initializeDatabase = async () => {
    try {
        console.log(createLogSignal(EVENTS.REQUEST_RECEIVED, { action: "DB_INIT_CHECK" }));

        // Simple check to see if we can query
        // In Level 1, we just want to ensure the connection works
        const result = await db.select().from(messages).limit(1);
        console.log(createLogSignal(EVENTS.REQUEST_SUCCESS, { action: "DB_CONNECTED", count: result.length }));

        return true;
    } catch (error) {
        console.error(createLogSignal(EVENTS.REQUEST_ERROR, { action: "DB_CONNECTION_FAILED", error: error.message }));
        return false;
    }
};
