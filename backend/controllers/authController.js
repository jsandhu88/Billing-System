import mongoose from "mongoose";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import User from "../models/user.js";

const authController = {};
authController.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      errors: errors.array().map((err) => err.msg),
      data: null,
    });
  }
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.json({
      errors: [
        {
          msg: "Email is already in use",
        },
      ],
      data: null,
    });
  }

  const hashedPass = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPass,
  });

  const UserId = await User.findOne({ email });
  console.log(UserId._id, "userId");

  const token = Jwt.sign({ id: UserId._id }, process.env.JWT_SECRET);

  res.json({
    errors: [],
    data: {
      token: token,
      id: newUser._id,
      email: newUser.email,
    },
  });
};

authController.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      errors: [
        {
          msg: "Email not found!",
        },
      ],
    });
  }

  const passMatch = await bcrypt.compare(password, user.password);

  if (!passMatch) {
    return res.json({
      errors: [
        {
          msg: "Invalid Password",
        },
      ],
    });
  }

  const UserId = await User.findOne({ email });
  const token = Jwt.sign({ id: UserId._id }, process.env.JWT_SECRET);

  res.json({
    errors: [],
    data: { token: token, id: user._id, email: user.email },
  });
};

export default authController;
