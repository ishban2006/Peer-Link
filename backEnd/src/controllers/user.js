const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const httpStatus = require("http-status");

const ExpressError = require("../utility/expressError");

module.exports.register = async (req, res) => {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        throw new ExpressError(
            400,
            "Please provide all fields"
        );
    }

    const existingUser = await User.findOne({
        username: username.trim()
    });

    if (existingUser) {
        throw new ExpressError(
            httpStatus.CONFLICT,
            "User already exists"
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);     // 10 Salts

    const token = crypto.randomBytes(20).toString("hex");

    const newUser = new User({
        name,
        username,
        password: hashedPassword,
        token
    });

    await newUser.save();

    return res.status(httpStatus.CREATED).json({
        message: "User Registered Successfully",
        token
    });
};