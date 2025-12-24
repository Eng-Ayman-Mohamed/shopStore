const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { connectDB } = require("./config/db");

const healthRouter = require("./routers/healthRouter");
const usersRouter = require("./routers/usersRouter");
const productsRouter = require("./routers/productsRoute");

const app = express();

// 1. Core Middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// app.js

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-user-id", // <--- ADD THIS LINE
      "X-Requested-With",
      "Accept",
    ],
    credentials: true, // Include this if you're using cookies or sessions
  })
);

// 2. HEALTH ROUTE (Must be before DB middleware)
// This will always return 200 even if DB is struggling
app.use("/api/health", healthRouter);

// 3. DB CONNECTION MIDDLEWARE
// Only applied to routes that actually need the database
const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    // Returning a 503 (Service Unavailable) is better than a 404
    res.status(503).json({ error: "Database temporarily unavailable" });
  }
};

// 4. PROTECTED DATA ROUTES
app.use("/api/users", dbMiddleware, usersRouter);
app.use("/api/products", dbMiddleware, productsRouter);

// 5. 404 CATCH-ALL
app.use((req, res) => {
  res.status(404).json({ message: "Route not found on this server" });
});

module.exports = app;
