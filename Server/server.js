// Load environment variables from .env
require("dotenv").config();

// Connect to MySQL database
require("./config/db");

// Import required packages
const express = require("express");
const cors = require("cors");

// Create Express application
const app = express();

// Middleware
// Allows frontend (React) to communicate with backend
app.use(cors());

// Allows Express to read JSON data from requests
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("SilaiMitra Backend is Running 🚀");
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});