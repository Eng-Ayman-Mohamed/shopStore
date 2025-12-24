const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // Ensure DATABASE env variable exists
  if (!process.env.DATABASE) {
    throw new Error("DATABASE environment variable is missing");
  }

  // Create a new connection promise if none exists
  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000, // Tell Mongoose to fail after 5s, not 30s
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      bufferCommands: false, // Don't queue commands if not connected
    };

    cached.promise = mongoose
      .connect(process.env.DATABASE, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  console.log("Database connected 🎇");
  return cached.conn;
}

module.exports = { connectDB };
