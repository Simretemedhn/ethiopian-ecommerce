const authService = require("../services/authService");

const register = async (req, res) => {
  const user = await authService.registerUser(req.validated.body);
  return res.status(201).json({ message: "User registered successfully", user });
};
const login = async (req, res) => {
  const { email, password } = req.validated.body;
  return res.status(200).json(await authService.loginUser(email, password));
};
const getCurrentUser = async (req, res) => res.status(200).json({
  user: { id: req.user._id.toString(), name: req.user.name, email: req.user.email, role: req.user.role },
});

module.exports = { register, login, getCurrentUser };
