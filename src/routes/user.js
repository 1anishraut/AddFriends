const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequests");
const userRouter = express.Router();
const User = require("../models/user");


const USER_SAFE_DATA =
  "firstName lastName photoUrl age gender about skills profession about company";



// GEt all the pending connection requests for all the logged in users
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    // Logic to get all pending connection requests
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      // "age",
      "gender",
      // "skills",
      "profession",
      // "company",
    ]);

    res.json({
      message: "Connectin Requests Fetched sucessfully",
      data: connectionRequests,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching requests", error: error.message });
  }
});

// GEt all the accepted requests
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser, status: "accepted" },
        { fromUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "skills",
        "profession",
        "company",
        "about",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "skills",
        "profession",
        "company",
        "about",
      ]);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Connectin Requests Fetched sucessfully",
      data: data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching requests", error: error.message });
  }
});

// Feed API
// User should see all the user card/profile except : own card, his connection, ignored people, allready sent the connection request
// userRouter.get("/feed", userAuth, async (req, res) => {
//     try {
//         const loggedInUser = req.user;

//         const page = parseInt(req.query.page) || 1;
//         let limit = parseInt(req.query.limit) || 10;
//         limit = limit > 50 ? 50 : limit;
//         const skip = (page - 1) * limit;

//         const connectionRequests = await ConnectionRequest.find({
//           $or: [
//             { fromUserId: loggedInUser._id },
//             { toUserId: loggedInUser._id },
//           ],
//         }).select("fromUserId  toUserId");

//         const hideUsersFromFeed = new Set();
//         connectionRequests.forEach((req) => {
//           hideUsersFromFeed.add(req.fromUserId.toString());
//           hideUsersFromFeed.add(req.toUserId.toString());
//         });
//       hideUsersFromFeed.add(loggedInUser._id.toString());

//         const users = await User.find({
//           $and: [
//             { _id: { $nin: Array.from(hideUsersFromFeed) } },
//             { _id: { $ne: loggedInUser._id } },
//           ],
//         })
//           .select(USER_SAFE_DATA)
//           .skip(skip)
//           .limit(limit);

//         res.json({ data: users });
      


//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching requests", error: error.message });
//   }
// });
// Feed API
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Get all connection requests where current user is either sender or receiver
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    // Build set of user IDs to exclude
    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // ✅ Exclude own profile explicitly
    hideUsersFromFeed.add(loggedInUser._id.toString());

    // Query all users except the hidden ones
    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching feed", error: error.message });
  }
});


module.exports = userRouter;
