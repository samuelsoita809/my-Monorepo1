import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`) });

export default defineConfig({
    schema: "./src/db/schema.js",
    out: "./src/db/migrations",
    dialect: "mysql",
    dbCredentials: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "user",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME || "inventory_db",
    },
});
