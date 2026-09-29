const mongoose = require("mongoose");
const dns = require("node:dns");
require("dotenv").config();

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

let cachedPromise = null;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongoDB connection successfully");
  } catch (error) {
    console.log("something wrong db connecting");
  }
};

module.exports = connectDB;
