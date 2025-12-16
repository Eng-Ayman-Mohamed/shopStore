const { connectDB } = require("../src/config/db");
const app = require("../src/app");

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

export default app;
