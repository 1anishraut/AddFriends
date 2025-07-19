const express = require("express");
require("./config/database");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const userData = req.body;
  // Creating new intance of the User model
  const user = new User(
    userData
    // {
    // firstName: 'Rohit',
    // lastName: 'Kumar',
    // emailId: 'anish@gmail.com',
    // password: 'Raut@2000'
    // }
  );
  try {
    await user.save();
    res.send("User Added Succefully");
  } catch (error) {
    res.status(400).send("Errer sending user Data" + error.message);
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
