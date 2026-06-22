const mongoose = require("mongoose");

const mongoURL = "mongodb://127.0.0.1:27017/ZoomIB";

const atlasURL = process.env.MONGOATLAS_DB_URL;

module.exports.configDB = async () => {
    try {
        await mongoose.connect(atlasURL);
        console.log("Connected to Database");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}