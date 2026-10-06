const userService =
    require("../services/userService");

const ApiError =
    require("../utils/ApiError");

const getUsers = async (
    req,
    res
) => {
    const page =
        req.query.page !== undefined
            ? Number(req.query.page)
            : 1;

    const limit =
        req.query.limit !== undefined
            ? Number(req.query.limit)
            : 10;

    const result =
        await userService.getAllUsers({
            page,
            limit,
            role: req.query.role,
            search: req.query.search
        });

    res.json(result);
};

const getUserById = async (
    req,
    res
) => {
    const user =
        await userService.getUserById(
            req.params.id
        );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    res.json(user);
};

const updateUser = async (
    req,
    res
) => {
    const {
        name,
        email
    } = req.body;

    if (!name || !email) {
        throw new ApiError(
            400,
            "Name and email are required"
        );
    }

    const user =
        await userService.updateUser(
            req.params.id,
            {
                name,
                email
            }
        );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    res.json({
        message:
            "User updated successfully",
        user
    });
};

const updateUserRole = async (
    req,
    res
) => {
    const { role } = req.body;

    if (!role) {
        throw new ApiError(
            400,
            "Role is required"
        );
    }

    const user =
        await userService.updateUserRole(
            req.params.id,
            role
        );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    res.json({
        message:
            "User role updated successfully",
        user
    });
};

const updateUserStatus = async (
    req,
    res
) => {
    const { isActive } = req.body;

    if (
        typeof isActive !== "boolean"
    ) {
        throw new ApiError(
            400,
            "isActive must be a boolean"
        );
    }

    const user =
        await userService.updateUserStatus(
            req.params.id,
            isActive
        );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    res.json({
        message:
            "User status updated successfully",
        user
    });
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    updateUserRole,
    updateUserStatus
};