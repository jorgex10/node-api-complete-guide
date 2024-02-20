const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email address already exists!");
          }
        });
      }),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().notEmpty(),
  ],
  authController.signup
);

module.exports = router;
