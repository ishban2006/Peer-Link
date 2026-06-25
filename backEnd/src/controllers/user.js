const User = require("../models/user");
const Meeting = require("../models/meeting");
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

module.exports.getUserHistory = async (req, res) => {
    const { token } = req.query;
    const user = await User.findOne({ token });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const meetings = await Meeting.find({
        user_id: user.username
    }).sort({ date: -1 });
    res.json(meetings);
}

module.exports.addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    const user = await User.findOne({ token: token });

    const existing = await Meeting.findOne({
        user_id: user.username,
        meetingCode: meeting_code
    });

    if (!existing) {
        await Meeting.create({
            user_id: user.username,
            meetingCode: meeting_code
        });
    }
    res.status(201).json({ message: "Added code to history" })
}