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

router.
    route("/add_to_activity")
        .post(
            wrapAsync(userController.addToHistory)
        );

router
    .route("/get_all_activity")
        .get(
            wrapAsync(userController.getUserHistory)
        );

module.exports = router;