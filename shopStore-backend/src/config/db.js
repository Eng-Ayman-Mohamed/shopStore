const mongoose = require("mongoose");

// Use global to persist connection across serverless function invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI environment variable is missing in Vercel settings"
    );
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000, // Fail after 5s instead of 30s
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Allow more concurrent DB operations
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((m) => {
        console.log("Database connected 🎇");
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Clear promise on error so we can retry
    throw e;
  }

  return cached.conn;
}

module.exports = { connectDB };
