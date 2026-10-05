const express = require("express");

const productRoutes =
    require("./routes/productRoutes");

const notFound =
    require("./middleware/notFoundMiddleware");

const errorHandler =
    require("./middleware/errorMiddleware");


const app = express();


// ============================================
// GLOBAL MIDDLEWARE
// ============================================

app.use(express.json());


// ============================================
// ROUTES
// ============================================

app.use(
    "/api/products",
    productRoutes
);


// ============================================
// 404 HANDLER
// ============================================

app.use(notFound);


// ============================================
// ERROR HANDLER
// ============================================

app.use(errorHandler);


// ============================================
// EXPORT APP
// ============================================

module.exports = app;