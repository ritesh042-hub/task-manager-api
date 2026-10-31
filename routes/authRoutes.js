const router = require("express").Router();
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");
const validate = require("../middleware/validate");

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2, max: 60 }).withMessage("Name must be 2-60 characters"),
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validate,
  login
);

module.exports = router;