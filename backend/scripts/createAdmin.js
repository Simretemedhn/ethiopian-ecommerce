require("dotenv").config();

const mongoose =
    require("mongoose");

const bcrypt =
    require("bcrypt");

const User =
    require("../src/models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "Connected to MongoDB"
        );

        const name = "System Admin";

        const email =
            process.env.BOOTSTRAP_ADMIN_EMAIL;

        const password =
            process.env.BOOTSTRAP_ADMIN_PASSWORD;

        if (!email || !password) {
            throw new Error(
                "BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD must be set in .env"
            );
        }

        const existingUser =
            await User.findOne({
                email
            });

        if (existingUser) {
            console.log(
                "Admin user already exists"
            );

            await mongoose.disconnect();

            return;
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: "superadmin"
        });

        console.log(
            "Superadmin user created successfully"
        );

        await mongoose.disconnect();

    } catch (error) {
        console.error(
            "Failed to create superadmin:",
            error.message
        );

        await mongoose.disconnect();

        process.exit(1);
    }
};

createAdmin();