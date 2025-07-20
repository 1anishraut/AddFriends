const express = require("express");
require("./config/database");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignupData } = require("./utils/Validation");
const bcrpt = require("bcrypt");

app.use(express.json());

// Signup API
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body
    const user = await User.findOne({ emailId: emailId })
    if (!user) {
      throw new Error("Invalid Credentials")
    }
    const isPasswordValid = await bcrpt.compare(password, user.password)
    if (isPasswordValid) {
      res.send("Login Sucessfuly")
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

// Find a user by emailId for ONE USER
app.get("/user", async (req, res) => {
  const userEmailId = req.body.emailId;

  try {
    const USER = await User.find({ emailId: userEmailId });
    if (USER.length === 0) {
      res.status(400).send("user email not found");
    } else {
      res.send(USER);
    }
  } catch (err) {
    res.status(400).send("user email not found");
  }
});

// Find all users for FEED API
app.get("/feed", async (req, res) => {
  try {
    const USER = await User.find({});
    res.send(USER);
  } catch (err) {
    res.status(400).send("user email not found");
  }
});

// Delete user by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const userDelete = await User.findByIdAndDelete(userId);
    res.send("User Deleted Secessfully");
  } catch (err) {
    res.status(400).send("Unable to delete User ");
  }
});

// Upadte user Patch
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const userData = req.body;

  try {
    const ALLOWED_UPDATE = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(userData).every((k) =>
      ALLOWED_UPDATE.includes(k)
    );
    // console.log(isUpdateAllowed);
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (userData.skills.length > 10) {
      throw new Error("Skills cannot be more then 10");
    }

    await User.findByIdAndUpdate({ _id: userId }, userData, {
      runValidators: true,
    });
    res.send("User Updated sucessfully");
  } catch (error) {
    res.status(400).send("Error in updating data" + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connection Sucessful");

    app.listen(3000, () => {
      console.log("Server is running on port 3000 -----------------");
    });
  })
  .catch((err) => {
    console.error("Getting errer in connecting database mongoDB");
  });

// haldling Auth Middleware

// app.use("/admin",(req, res, next)=> {
//   const token = "xyza"
//   const isAdminAuthorized = token === "xyza"
//   if (!isAdminAuthorized) {
//     res.status(401).send("Unauthorized User")
//   } else next();
// })

// app.get("/admin/getUserData", (req, res) => {
//   res.send("Send User Data")
// })

// app.get("/admin/deleteUserData", (req, res) => {
//   res.send("delete User Data");
// });

// Error handeling
// app.use("/", (err, req, res, next)=> {
//   if (err) {
//     res.status(500).send("Someting Went Wrong....")
//   }
// })

// Handling multiple routes
// app.use("/next", (req, res, next) => {
//   console.log("FIRST REQUEST");
//   next()
// },

//   (req, res, next) => {
//     console.log("SECOND RESPONSE")
//     // res.send("SECOND RESPONSE");
//     next()
//   }
// )

// app.use("/next", (req, res) => {
//   console.log("THIRD RESPONSE");
//   res.send("THIRD RESPONSE")

// })

// This will only match GET requests for the path "/test"
// app.get("/user", (req, res) => {
//   res.send({
//     firstName: "Anish",
//     lastName: "Kumar"
//   });
// });

// app.post("/user", (req, res) => {
//   console.log("Data POST to User");
//   res.send("Data Post sucessfull")

// })

// app.delete("/user", (req, res) => {
//   console.log("Data DELETED to User");
//   res.send("Data DELETED sucessfull");
// });

// This will match all tha HTTP mrthods (GET, POST, PUT, DELETE, etc.) for the path "/test"
// app.use("/test", (req, res) => {
//     res.send("Hello, World");
// });

// app.use("/", (req, res) => {
//   res.send("first respo nse");
// });
