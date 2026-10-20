const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details || undefined;

  if (err.code === 11000) {
    statusCode = 409;
    message = "A user with this email already exists";
    details = undefined;
  }
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
    details = undefined;
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Database validation failed";
    details = undefined;
  }
  if (statusCode >= 500) {
    console.error(err);
    message = "Internal server error";
    details = undefined;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
};

module.exports = errorHandler;
