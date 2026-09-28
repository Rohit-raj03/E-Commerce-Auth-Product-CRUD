const mongoose = require("mongoose");
const dns = require("node:dns");
require("dotenv").config();

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}


let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!cachedPromise) {
    const uri = process.env.MONGODB_URI;
    cachedPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    }).then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }).catch((error) => {
      cachedPromise = null;
      console.error(`Database Connection Error: ${error.message}`);
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
      throw error;
    });
  }

  return cachedPromise;
};

module.exports = connectDB;
