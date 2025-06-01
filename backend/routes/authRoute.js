import express from "express";
const authRoute = express.Router();
import authController from "../controllers/authController.js";

import { body } from "express-validator";

authRoute.post(
  "/signin",
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email is invalid")
    .bail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),
  authController.signup
);

authRoute.post("/login", authController.login);

export default authRoute;
