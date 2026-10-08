const errorHandler = (
    err,
    req,
    res,
    next
) => {

    console.error(err);


    // ========================================
    // DEFAULT STATUS CODE
    // ========================================

    let statusCode =
        err.statusCode || 500;


    // ========================================
    // DEFAULT MESSAGE
    // ========================================

    let message =
        err.message ||
        "Internal server error";


    // ========================================
    // MONGOOSE INVALID OBJECT ID
    // ========================================

    if (
        err.name === "CastError"
    ) {

        statusCode = 400;

        message =
            "Invalid resource ID";
    }


    // ========================================
    // MONGOOSE VALIDATION ERROR
    // ========================================

    if (
        err.name === "ValidationError"
    ) {

        statusCode = 400;

        message =
            "Database validation failed";
    }


    // ========================================
    // MONGODB DUPLICATE KEY ERROR
    // ========================================

    if (
        err.code === 11000
    ) {

        statusCode = 409;

        const duplicatedField =
            Object.keys(
                err.keyValue || {}
            )[0];

        message =
            duplicatedField
                ? `${duplicatedField} already exists`
                : "A resource with this value already exists";
    }


    // ========================================
    // RESPONSE OBJECT
    // ========================================

    const response = {

        message
    };


    // ========================================
    // CUSTOM VALIDATION ERRORS
    // ========================================

    if (err.errors) {

        response.errors =
            err.errors;
    }


    // ========================================
    // SEND RESPONSE
    // ========================================

    res
        .status(statusCode)
        .json(response);
};


module.exports =
    errorHandler;