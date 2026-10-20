const User = require("../models/User");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getAllUsers = async ({ page, limit, role, search }) => {
  const query = {};
  if (role) query.role = role;
  if (search) {
    const safeSearch = escapeRegex(search);
    query.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { email: { $regex: safeSearch, $options: "i" } },
    ];
  }
  const skip = (page - 1) * limit;
  const [users, totalUsers] = await Promise.all([
    User.find(query).select("-password").skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    User.countDocuments(query),
  ]);
  return { users, pagination: { page, limit, totalUsers, totalPages: Math.ceil(totalUsers / limit) } };
};

const getUserById = (id) => User.findById(id).select("-password").lean();
const updateUser = (id, { name, email }) => User.findByIdAndUpdate(id, { $set: { name: name.trim(), email: email.trim().toLowerCase() } }, { new: true, runValidators: true }).select("-password").lean();
const updateUserRole = (id, role) => User.findByIdAndUpdate(id, { $set: { role } }, { new: true, runValidators: true }).select("-password").lean();
const updateUserStatus = (id, isActive) => User.findByIdAndUpdate(id, { $set: { isActive } }, { new: true, runValidators: true }).select("-password").lean();

module.exports = { getAllUsers, getUserById, updateUser, updateUserRole, updateUserStatus };
