import dotenv from "dotenv";
import path from "path";

// Load .env from project root before any tests run (Jest does not run test files from project root).
dotenv.config({ path: path.resolve(__dirname, "../.env") });
