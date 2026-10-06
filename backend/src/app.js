const express = require("express");

const productRoutes =
    require("./routes/productRoutes");

const authRoutes =
    require("./routes/authRoutes");

const userRoutes =
    require("./routes/userRoutes");

const notFound =
    require("./middleware/notFoundMiddleware");

const errorHandler =
    require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());

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

app.use(notFound);

app.use(errorHandler);

module.exports = app;