const serverless = require("serverless-http");
const { connectDB } = require("../config/db");
const app = require("../app");

// Ensure DB is connected on cold start; serverless environments may reuse containers.
let isConnected = false;
const ensureConnected = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

ensureConnected().catch((err) => {
  console.error("Error connecting to DB (serverless):", err);
});

module.exports = serverless(app);
