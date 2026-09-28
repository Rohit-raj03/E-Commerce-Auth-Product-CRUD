const mongoose = require("mongoose");
const dns = require("node:dns");
require("dotenv").config();

// Configure DNS for MongoDB Atlas SRV lookup on Windows/local networks
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // fallback gracefully
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to MongoDB database using Mongoose.
 * Reads purely from process.env.MONGODB_URI with no hardcoding.
 */
const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        cached.promise = null;
        console.error(`Database Connection Error: ${error.message}`);
        if (process.env.NODE_ENV !== "production") {
          process.exit(1);
        }
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    throw error;
  }
};

module.exports = connectDB;
