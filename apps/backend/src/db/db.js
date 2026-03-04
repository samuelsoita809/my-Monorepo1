import "../env.js";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema.js";

// Connection pool configuration
const connectionConfig = process.env.DATABASE_URL
    ? { uri: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "user",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME || "inventory_db",
        port: parseInt(process.env.DB_PORT || "3306"),
    };

const isAiven = (process.env.DATABASE_URL?.includes("aivencloud.com") || process.env.DB_HOST?.includes("aivencloud.com"));
const isRailway = (process.env.DATABASE_URL?.includes("rlwy.net") || process.env.DB_HOST?.includes("rlwy.net"));

const connection = mysql.createPool({
    ...connectionConfig,
    multipleStatements: true,
    ssl: isAiven || (process.env.NODE_ENV === "production" && !isRailway) ? { rejectUnauthorized: false } : undefined,
});

// Handle pool errors to prevent process crashes
connection.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export const db = drizzle(connection, { schema, mode: "default" });
