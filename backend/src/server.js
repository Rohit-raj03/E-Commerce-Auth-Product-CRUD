const dns = require("node:dns");
require("dotenv").config();

// Use public DNS servers to resolve MongoDB Atlas SRV records on Windows/ISP networks
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // fallback gracefully
}

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
