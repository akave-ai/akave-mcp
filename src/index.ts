#!/usr/bin/env node

import { AkaveMCPServer } from "./server.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

// Load environment variables from .env file if it exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "..", ".env");

if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

// Check for required environment variables
const requiredEnvVars = [
  "AKAVE_ACCESS_KEY_ID",
  "AKAVE_SECRET_ACCESS_KEY",
  "AKAVE_ENDPOINT_URL",
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error("Error: Missing required environment variables:");
  missingEnvVars.forEach((varName) => {
    console.error(`  - ${varName}`);
  });
  console.error(
    "\nPlease set these environment variables or create a .env file with them."
  );
  process.exit(1);
}

async function main() {
  const server = new AkaveMCPServer();

  process.on("SIGINT", async () => {
    console.log("\nShutting down...");
    await server.stop();
    process.exit(0);
  });

  try {
    await server.start();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
