const env = require("./config/env");

const app = require("./app");
const connectDB = require("./config/database");

const PORT = env.PORT;

connectDB().then(() => {

    app.listen(PORT, () => {

        console.log(`Server running on port ${PORT}`);

    });

});