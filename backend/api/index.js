const app = require('../src/app');
const connectDB = require('../src/config/db');

// Connect to MongoDB Atlas in serverless function environment
connectDB();

module.exports = app;
