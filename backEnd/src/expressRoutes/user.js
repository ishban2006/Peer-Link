const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/wrapAsync");
const userController = require("../controllers/user");

router
    .route("/register")
        .post(
            wrapAsync(userController.register)
        );

module.exports = router;