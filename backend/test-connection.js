require("dotenv").config();
const mongoose = require("mongoose");

const testConnection = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        console.log("URI starts with:", process.env.MONGO_URI.substring(0, 30));
        
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000 // 10 second timeout
        });
        
        console.log("✅ SUCCESS! MongoDB connected.");
        process.exit(0);
    } catch (error) {
        console.error("❌ FAILED:", error.message);
        console.error("Full error:", error);
        process.exit(1);
    }
};

testConnection();