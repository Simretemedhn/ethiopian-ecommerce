const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const toPublicUser = (user) => ({ id: user._id.toString(), name: user.name, email: user.email, role: user.role });

const createToken = (user) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.findOne({ email: normalizedEmail })) {
    throw new ApiError(409, "A user with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
    return toPublicUser(user);
  } catch (error) {
    if (error.code === 11000) throw new ApiError(409, "A user with this email already exists");
    throw error;
  }
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (!user.isActive) throw new ApiError(403, "Your account has been disabled");
  return { token: createToken(user), user: toPublicUser(user) };
};

module.exports = { registerUser, loginUser };
