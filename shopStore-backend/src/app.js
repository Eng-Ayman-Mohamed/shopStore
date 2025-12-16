const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const healthRouter = require("./routers/healthRouter");
const usersRouter = require("./routers/usersRouter");
const productsRouter = require("./routers/productsRoute");
//MiddleWares
app.use(morgan("dev"));
// Increase limit to 10MB (default is 100kb)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// Or configure specific origins (Recommended)
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If using cookies/auth
  })
);

//user routes
app.use("/api/health", healthRouter);
app.use("/api/users", usersRouter);

//products routes
app.use("/api/products", productsRouter);
module.exports = app;
