const jwt = require("jsonwebtoken");

const User = require("../models/User");

const ApiError =
    require("../utils/ApiError");

const protect = async (
    req,
    res,
    next
) => {
    const authHeader =
        req.headers.authorization;

    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
    ) {
        return next(
            new ApiError(
                401,
                "Authentication required"
            )
        );
    }

    const token =
        authHeader.split(" ")[1];

    try {
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        const user =
            await User.findById(
                decoded.userId
            );

        if (!user) {
            return next(
                new ApiError(
                    401,
                    "User no longer exists"
                )
            );
        }

        if (!user.isActive) {
            return next(
                new ApiError(
                    403,
                    "Your account has been disabled"
                )
            );
        }

        req.user = user;

        next();

    } catch (error) {
        return next(
            new ApiError(
                401,
                "Invalid or expired token"
            )
        );
    }
};

module.exports = protect;