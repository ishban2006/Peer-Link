const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/wrapAsync");
const userController = require("../controllers/user");

router
    .route("/register")
        .post(
            wrapAsync(userController.register)
        );

router.
    route("/login")
        .post(
            wrapAsync(userController.login)
        );

module.exports = router;