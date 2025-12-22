const { connectDB } = require("../src/config/db");
const app = require("../src/app");

// Ensure DB is connected once per serverless container
let isConnected = false;

const ensureConnected = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("Database connected on cold start ✅");
    } catch (err) {
      console.error("Error connecting to DB (serverless):", err);
    }
  }
};

// Immediately try to connect
ensureConnected();

module.exports = app;
