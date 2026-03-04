import "../env.js";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema.js";

// Connection pool configuration
const connection = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "inventory_db",
    port: parseInt(process.env.DB_PORT || "3306"),
    multipleStatements: true,
    ssl: process.env.DB_HOST?.includes("aivencloud.com") || (process.env.NODE_ENV === "production" && !process.env.DB_HOST?.includes("rlwy.net")) ? { rejectUnauthorized: false } : undefined,
});

// Handle pool errors to prevent process crashes
connection.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export const db = drizzle(connection, { schema, mode: "default" });
