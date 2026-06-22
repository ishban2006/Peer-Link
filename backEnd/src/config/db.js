const mongoose = require("mongoose");

const mongoURL = "mongodb://127.0.0.1:27017/ZoomIB";

module.exports.configDB = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log("Connected to Database");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}