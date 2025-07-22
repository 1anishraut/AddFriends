const express = require("express")
const requestRouter = express.Router()

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequests")
const User = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id  // getting loggedIn user id from userAuth middleware
    const toUserId = req.params.toUserId
    const status = req.params.status

    const toUser = await User.findById(toUserId)
    if (!toUser) {
      return res.status(400).json({
        message: "This user does not exit",
        status,
      });
    }

    const allowedStatus = ["ignored", "interested"]
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid send status",
        status
      })
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
        // {fromUserId: fromUserId}  // cannot send req to yourselg API level validation
      ],
    })
    if (existingConnectionRequest) {
      return res.status(400).json({
        message: "Connection Request Already Exist",
        status,
      });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
})

    const data = await connectionRequest.save()
    res.json(
      {
        message: "Connection Request Sent to " + toUser.firstName,
        data
      }
    )

    
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

module.exports = requestRouter