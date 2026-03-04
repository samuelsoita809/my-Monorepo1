import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`) });

export default defineConfig({
    schema: "./src/db/schema.js",
    out: "./src/db/migrations",
    dialect: "mysql",
    dbCredentials: {
        url: process.env.DATABASE_URL || `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        ssl: process.env.DATABASE_URL?.includes("aivencloud.com") || process.env.DB_HOST?.includes("aivencloud.com") ? { rejectUnauthorized: false } : undefined,
    },
});

console.log(`[DRIZZLE] Using database URL: ${process.env.DATABASE_URL ? 'CMD_LINE_URL' : 'DOTENV_URL'}`);
