class ApiError extends Error {

    constructor(statusCode, message, errors) {

        super(message);

        this.statusCode = statusCode;

        this.name = "ApiError";

        if (errors) {
            this.errors = errors;
        }
    }
}

module.exports = ApiError;
