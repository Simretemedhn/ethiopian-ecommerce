const User = require("../models/User");

const ApiError =
    require("../utils/ApiError");

const getAllUsers = async ({
    page = 1,
    limit = 10,
    role,
    search
}) => {
    const query = {};

    if (role) {
        query.role = role;
    }

    if (search) {
        query.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                email: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    const skip =
        (page - 1) * limit;

    const users =
        await User
            .find(query)
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({
                createdAt: -1
            });

    const totalUsers =
        await User.countDocuments(query);

    return {
        users,
        pagination: {
            page,
            limit,
            totalUsers,
            totalPages:
                Math.ceil(
                    totalUsers / limit
                )
        }
    };
};

const getUserById = async (id) => {
    return await User
        .findById(id)
        .select("-password");
};

const updateUser = async (
    id,
    updateData
) => {
    return await User.findByIdAndUpdate(
        id,
        {
            name: updateData.name,
            email: updateData.email
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password");
};

const updateUserRole = async (
    id,
    role
) => {
    const allowedRoles = [
        "customer",
        "admin",
        "superadmin"
    ];

    if (!allowedRoles.includes(role)) {
        throw new ApiError(
            400,
            "Invalid role"
        );
    }

    return await User.findByIdAndUpdate(
        id,
        {
            role
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password");
};

const updateUserStatus = async (
    id,
    isActive
) => {
    return await User.findByIdAndUpdate(
        id,
        {
            isActive
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password");
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    updateUserRole,
    updateUserStatus
};