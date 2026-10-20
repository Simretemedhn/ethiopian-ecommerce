
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

const PORT = Number(process.env.PORT) || 4001;
let server;
let shuttingDown = false;

const shutdown = (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received. Shutting down User Service...`);
  if (!server) {
    mongoose.disconnect().finally(() => process.exit(0));
    return;
  }
  server.close((error) => {
    if (error) {
      console.error("HTTP server shutdown failed:", error);
      process.exitCode = 1;
    }
    mongoose.disconnect()
      .then(() => console.log("User Service shut down"))
      .catch((disconnectError) => {
        console.error("MongoDB disconnect failed:", disconnectError);
        process.exitCode = 1;
      });
  });
};

const startServer = async () => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  await connectDB();
  server = app.listen(PORT, () => console.log(`User Service listening on port ${PORT}`));
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer().catch(async (error) => {
  console.error("Failed to start User Service:", error.message);
  try {
    await mongoose.disconnect();
  } finally {
    process.exitCode = 1;
  }
});
