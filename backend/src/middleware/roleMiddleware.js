const ApiError =
    require("../utils/ApiError");


const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {

        if (!req.user) {

            return next(
                new ApiError(
                    401,
                    "Authentication required"
                )
            );
        }

        if (
            !allowedRoles.includes(
                req.user.role
            )
        ) {

            return next(
                new ApiError(
                    403,
                    "You are not authorized to perform this action"
                )
            );
        }

        next();
    };
};


module.exports = authorizeRoles;