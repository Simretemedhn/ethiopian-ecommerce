const authService =
    require("../services/authService");

const login = async (
    req,
    res
) => {
    const {
        email,
        password
    } = req.validated.body;

    const result =
        await authService.loginUser(
            email,
            password
        );

    res.status(200).json(result);
};

const register = async (
    req,
    res
) => {
    const {
        name,
        email,
        password
    } = req.validated.body;

    const user =
        await authService.registerUser({
            name,
            email,
            password
        });

    res.status(201).json({
        message:
            "User registered successfully",
        user
    });
};

const getCurrentUser = async (
    req,
    res
) => {
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
};

module.exports = {
    register,
    login,
    getCurrentUser
};