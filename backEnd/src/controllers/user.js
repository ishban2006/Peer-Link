const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
            409,
            "User already exists"
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(20).toString("hex");

    const newUser = new User({
        name,
        username,
        password: hashedPassword,
        token
    });

    await newUser.save();

    return res.status(201).json({
        message: "User Registered Successfully",
        token
    });
};

module.exports.login = async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        throw new ExpressError(
            400,
            "Please provide username and password"
        );
    }

    const user = await User.findOne({ username });

    if (
        !user ||
        !(await bcrypt.compare(password, user.password))
    ) {
        throw new ExpressError(
            401,
            "Invalid username or password"
        );
    }

    const token = crypto.randomBytes(20).toString("hex");

    user.token = token;
    await user.save();

    return res.status(200).json({
        token
    });
};