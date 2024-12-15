const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express(); // Middleware
require('dotenv').config();

// Adjusted CORS configuration to allow requests from any origin
app.use(cors({
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true, // Allow credentials if needed
  }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// MongoDB Connection
const MONGODB_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/formbuilder";

mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import Routes
const formRoutes = require("./Routes/formRoutes");
const responseRoutes = require("./Routes/responseRoute"); 

// Use Routes 
app.use('/api/forms', formRoutes); 
app.use('/api/responses', responseRoutes); 

// Example error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`); 
}); 

module.exports = app;
