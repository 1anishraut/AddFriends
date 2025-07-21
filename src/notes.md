-                                               Find a user by emailId for ONE USER
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

-                                                   Find all users for FEED API
app.get("/feed", async (req, res) => {
  try {
    const USER = await User.find({});
    res.send(USER);
  } catch (err) {
    res.status(400).send("user email not found");
  }
});

-                                                     Delete user by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const userDelete = await User.findByIdAndDelete(userId);
    res.send("User Deleted Secessfully");
  } catch (err) {
    res.status(400).send("Unable to delete User ");
  }
});

-                                                       Upadte user Patch
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