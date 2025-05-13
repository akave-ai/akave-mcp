#!/usr/bin/env node

import { AkaveMCPServer } from "./server.js";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const server = new AkaveMCPServer();

  process.on("SIGINT", async () => {
    console.log("Shutting down...");
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
