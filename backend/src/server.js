const dns = require("node:dns");
require("dotenv").config();

// Convert SRV URI to standard replica set URI to bypass Windows querySrv ECONNREFUSED
if (
  process.env.MONGODB_URI &&
  process.env.MONGODB_URI.startsWith("mongodb+srv://") &&
  process.env.MONGODB_URI.includes("cluster0.r6gi37h.mongodb.net")
) {
  process.env.MONGODB_URI =
    "mongodb://rohitrajchy03_db_user:lMHkjweqo4SUAPqy@ac-4dc23wy-shard-00-00.r6gi37h.mongodb.net:27017,ac-4dc23wy-shard-00-01.r6gi37h.mongodb.net:27017,ac-4dc23wy-shard-00-02.r6gi37h.mongodb.net:27017/authentication_product_crud?ssl=true&replicaSet=atlas-mx80u2-shard-0&authSource=admin&retryWrites=true&w=majority";
}

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
