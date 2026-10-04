// Import Express.
const express = require("express");

// Load environment variables from .env.
require("dotenv").config();


// Import our product routes.
//
// This imports the router we created inside:
//
// src/routes/productRoutes.js
//
const productRoutes = require("./routes/productRoutes");


// Create the Express application.
const app = express();


// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

// Parse incoming JSON request bodies.
app.use(express.json());


// --------------------------------------------------
// ROUTES
// --------------------------------------------------

// Tell Express:
//
// "Whenever a request starts with /api/products,
// send it to productRoutes."
//
app.use("/api/products", productRoutes);


// --------------------------------------------------
// SERVER
// --------------------------------------------------

const PORT = process.env.PORT;


// Start the server.
app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});