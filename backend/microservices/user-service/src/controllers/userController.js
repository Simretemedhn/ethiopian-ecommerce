const userService = require("../services/userService");
const ApiError = require("../utils/ApiError");

const getUsers = async (req, res) => res.status(200).json(await userService.getAllUsers(req.validated.query));
const getUserById = async (req, res) => {
  const user = await userService.getUserById(req.validated.params.id);
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(user);
};
const updateUser = async (req, res) => {
  const user = await userService.updateUser(req.validated.params.id, req.validated.body);
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json({ message: "User updated successfully", user });
};
const updateUserRole = async (req, res) => {
  const user = await userService.updateUserRole(req.validated.params.id, req.validated.body.role);
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json({ message: "User role updated successfully", user });
};
const updateUserStatus = async (req, res) => {
  const user = await userService.updateUserStatus(req.validated.params.id, req.validated.body.isActive);
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json({ message: "User status updated successfully", user });
};

module.exports = { getUsers, getUserById, updateUser, updateUserRole, updateUserStatus };
