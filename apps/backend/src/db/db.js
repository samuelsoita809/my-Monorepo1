import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema.js";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables based on NODE_ENV if not already loaded
const envPath = join(__dirname, '../../', `.env.${process.env.NODE_ENV || 'development'}`);
dotenv.config({ path: envPath });

// Connection pool configuration
const connection = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "inventory_db",
    multipleStatements: true,
});

// Handle pool errors to prevent process crashes
connection.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export const db = drizzle(connection, { schema, mode: "default" });
