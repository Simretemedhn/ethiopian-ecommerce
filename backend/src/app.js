const express = require("express");

require("dotenv").config();


// ============================================
// IMPORT ROUTES
// ============================================

const productRoutes =
    require("./routes/productRoutes");


// ============================================
// IMPORT MIDDLEWARE
// ============================================

const notFound =
    require("./middleware/notFoundMiddleware");

const errorHandler =
    require("./middleware/errorMiddleware");


// ============================================
// CREATE EXPRESS APPLICATION
// ============================================

const app = express();


// ============================================
// GLOBAL MIDDLEWARE
// ============================================

// Tell Express to understand JSON request bodies.
app.use(express.json());


// ============================================
// API ROUTES
// ============================================

app.use(
    "/api/products",
    productRoutes
);


// ============================================
// 404 MIDDLEWARE
// ============================================

// This must come AFTER our routes.
app.use(notFound);


// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// This should be the final middleware.
app.use(errorHandler);


// ============================================
// SERVER
// ============================================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );
    }
);