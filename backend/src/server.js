require("dotenv").config();

const app =
    require("./app");

const connectDB =
    require("./config/db");


const PORT =
    process.env.PORT || 5000;


// ============================================
// START SERVER
// ============================================

const startServer = async () => {

    try {

        // Connect to MongoDB first.
        await connectDB();


        // Start Express after
        // successful database connection.
        app.listen(
            PORT,
            () => {

                console.log(
                    `Server running on http://localhost:${PORT}`
                );
            }
        );

    } catch (error) {

        console.error(
            "Failed to start server:",
            error.message
        );

        process.exit(1);
    }
};


startServer();