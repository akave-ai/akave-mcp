import { AkaveMCPServer } from "./server";

async function main() {
  const server = new AkaveMCPServer();

  process.on("SIGINT", async () => {
    console.log("Shutting down...");
    await server.stop();
    process.exit(0);
  });

  await server.start();
}

main().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
