const express = require("express")
const authRouter = express.Router()

const { validateSignupData } = require("../utils/Validation");
const User = require("../models/user");
const bcrpt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Signup API
authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of the data
    validateSignupData(req);

    // Encrypy the Password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrpt.hash(password, 10);
    // console.log(passwordHash);

    // Creating new intance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added Succefully");
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

// Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // Create JWT Token
      const token = await user.getJWT()

      // Add token to cookie and send back to user
      res.cookie("token", token);
      res.send("Login Sucessfuly");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR in login:" + error.message);
  }
});

module.exports = authRouter