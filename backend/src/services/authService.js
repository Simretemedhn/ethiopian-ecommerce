const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const ApiError = require("../utils/ApiError");


// ============================================
// REGISTER USER
// ============================================

const registerUser = async (userData) => {

    const {
        name,
        email,
        password
    } = userData;

    // Check whether this email
    // already belongs to another user.
    const existingUser =
        await User.findOne({ email });

    if (existingUser) {

        throw new ApiError(
            409,
            "A user with this email already exists"
        );
    }

    // Convert the plaintext password
    // into a secure bcrypt hash.
    const hashedPassword =
        await bcrypt.hash(
            password,
            12
        );

    // Create the user using
    // the hashed password.
    const user =
        await User.create({
            name,
            email,
            password: hashedPassword
        });

    // Return only safe information.
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
};


// ============================================
// LOGIN USER
// ============================================

const loginUser = async (
    email,
    password
) => {

    // password has select:false in the schema,
    // so explicitly request it for login.
    const user =
        await User.findOne({ email })
            .select("+password");

    if (!user) {

        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    // Compare the plaintext password
    // against the stored bcrypt hash.
    const passwordMatches =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!passwordMatches) {

        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    // Create a JWT containing
    // the user's identity and role.
    const token =
        jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};


module.exports = {
    registerUser,
    loginUser
};