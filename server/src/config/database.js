const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(env.MONGODB_URI);

        console.log(`MongoDB Connected : ${connection.connection.host}`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;