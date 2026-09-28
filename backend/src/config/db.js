const mongoose = require("mongoose");
const dns = require("node:dns");
require("dotenv").config();

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

/**
 * Converts SRV Atlas URI to direct standard replica set URI
 * to avoid Windows / local ISP querySrv ECONNREFUSED permanently.
 */
const getCleanMongoURI = (rawUri) => {
  if (!rawUri) return rawUri;
  if (rawUri.startsWith("mongodb+srv://") && rawUri.includes("cluster0.r6gi37h.mongodb.net")) {
    return "mongodb://rohitrajchy03_db_user:lMHkjweqo4SUAPqy@ac-4dc23wy-shard-00-00.r6gi37h.mongodb.net:27017,ac-4dc23wy-shard-00-01.r6gi37h.mongodb.net:27017,ac-4dc23wy-shard-00-02.r6gi37h.mongodb.net:27017/authentication_product_crud?ssl=true&replicaSet=atlas-mx80u2-shard-0&authSource=admin&retryWrites=true&w=majority";
  }
  return rawUri;
};

const connectDB = async () => {
  try {
    const uri = getCleanMongoURI(process.env.MONGODB_URI);
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
