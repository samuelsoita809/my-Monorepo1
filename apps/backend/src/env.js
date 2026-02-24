import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables immediately on file import
const envPath = join(__dirname, '..', `.env.${process.env.NODE_ENV || 'development'}`);
dotenv.config({ path: envPath });

console.log(`[ENV] Loaded from: ${envPath}`);
