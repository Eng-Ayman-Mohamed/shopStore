const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("Database connected successfully 🎇");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

module.exports = { connectDB };
