const express =
    require("express");

const productRoutes =
    require("./routes/productRoutes");

const authRoutes =
    require("./routes/authRoutes");

const userRoutes =
    require("./routes/userRoutes");

const cartRoutes =
    require("./routes/cartRoutes");

const orderRoutes =
    require("./routes/orderRoutes");

const notFound =
    require("./middleware/notFoundMiddleware");

const errorHandler =
    require("./middleware/errorMiddleware");


const app =
    express();


// ============================================
// GLOBAL MIDDLEWARE
// ============================================

app.use(
    express.json()
);


// ============================================
// ROUTES
// ============================================

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/cart",
    cartRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);


// ============================================
// 404 HANDLER
// ============================================

app.use(
    notFound
);


// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(
    errorHandler
);


module.exports =
    app;