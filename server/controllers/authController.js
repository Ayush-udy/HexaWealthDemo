const express = require("express");
const JWT = require("jsonwebtoken");

const userModel = require("../models/UserModel");
const { hashPassword, comaprePassword } = require("../utils/authHelper");

exports.signUpController = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Validation
    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is required" });
    }
    if (!confirmPassword) {
      return res.status(400).send({ message: "Confirm Password is required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).send({ message: "Passwords do not match" });
    }
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "User already registered. Please log in.",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Save the user
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      role: role || "user",
    }).save();

    res.status(201).send({
      success: true,
      message: "User registration successful",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await comaprePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        userId: user._id,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      err,
    });
  }
};
