const app = require("../src/app");
const { connectDB } = require("../src/config/db");

// Background connect to "warm up" the cold start
connectDB().catch((err) =>
  console.log("Background DB connection warming up...")
);

module.exports = app;
