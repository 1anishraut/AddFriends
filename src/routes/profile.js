const express = require("express")
const profileRouter = express.Router()

const { userAuth } = require("../middleware/auth");
const User = require("../models/user");


// Get prfile
profileRouter.get("/profile", userAuth, async (req, res) => {
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

module.exports = profileRouter