import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema.js";

// Connection pool configuration
// For initial Level 1, credentials are heart-coded
const connection = await mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "inventory_db",
    multipleStatements: true,
});

export const db = drizzle(connection, { schema, mode: "default" });
