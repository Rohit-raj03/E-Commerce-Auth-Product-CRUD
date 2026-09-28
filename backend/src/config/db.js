const mongoose = require("mongoose");
const dns = require("node:dns");
require("dotenv").config();

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

const getCleanMongoURI = (rawUri) => {
  if (!rawUri) return rawUri;
  if (rawUri.startsWith("mongodb+srv://") && rawUri.includes("cluster0.r6gi37h.mongodb.net")) {
    return "mongodb://rohitrajchy03_db_user:lMHkjweqo4SUAPqy@ac-4dc23wy-shard-00-00.r6gi37h.mongodb.net:27017,ac-4dc23wy-shard-00-01.r6gi37h.mongodb.net:27017,ac-4dc23wy-shard-00-02.r6gi37h.mongodb.net:27017/authentication_product_crud?ssl=true&replicaSet=atlas-mx80u2-shard-0&authSource=admin&retryWrites=true&w=majority";
  }
  return rawUri;
};

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!cachedPromise) {
    const uri = getCleanMongoURI(process.env.MONGODB_URI);
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
