const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  let decoded;
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
    decoded = jwt.verify(authHeader.slice("Bearer ".length), process.env.JWT_SECRET);
  } catch {
    return next(new ApiError(401, "Invalid or expired token"));
  }

  try {
    if (!decoded.userId) return next(new ApiError(401, "Invalid token payload"));
    const user = await User.findById(decoded.userId);
    if (!user) return next(new ApiError(401, "User no longer exists"));
    if (!user.isActive) return next(new ApiError(403, "Your account has been disabled"));
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = protect;
