const express = require("express")
const profileRouter = express.Router()
const {
  validateEditProfileData,
  validatePasswordOnly,
} = require("../utils/Validation");

const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");



// Get prfile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    // const cookies = req.cookies;
    // const { token } = cookies;

    // if (!token) {
    //   throw new Error("Invalid token")
    // }

    // Velidate my token
    // const decodedMessage = await jwt.verify(token, "Raut@2000");
    // const { _id } = decodedMessage;
    // console.log("Logged In user is " + _id);

    // console.log(decodedMessage);
    const user = req.user;

    // console.log(cookies);
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

// Edit Profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if(!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request")
    }
    
    const loggedInUser = req.user
    // console.log(loggedInUser);

    const userKeys = Object.keys(req.body)
    // console.log(userKeys);
    userKeys.forEach((key) => (loggedInUser[key] = req.body[key]))
    await loggedInUser.save()
    // res.send( `${loggedInUser.firstName}, Profile edit successful`)

    const { password, ...safeUser } = loggedInUser.toObject();
    res.send({
      message: `${loggedInUser.firstName}, Profile edit successful`,
      updatedProfile: safeUser,
    });

    
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
})


// Forgot password API
profileRouter.post("/profile/forgot-password", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("Both email and new password are required");
    }

    // ✅ Reuse your custom validator
    validatePasswordOnly(password);

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("User with this email does not exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    res.send("Password has been reset successfully");
  } catch (error) {
    res.status(400).send("ERROR in forgot password: " + error.message);
  }
});


module.exports = profileRouter