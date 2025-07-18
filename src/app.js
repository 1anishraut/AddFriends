const express = require('express');
const app = express();


// This will only match GET requests for the path "/test"
app.get("/user", (req, res) => {
  res.send({
    firstName: "Anish",
    lastName: "Kumar"
  });
});

app.post("/user", (req, res) => {
  console.log("Data POST to User");
  res.send("Data Post sucessfull")
  
})

app.delete("/user", (req, res) => {
  console.log("Data DELETED to User");
  res.send("Data DELETED sucessfull");
});



// This will match all tha HTTP mrthods (GET, POST, PUT, DELETE, etc.) for the path "/test"
app.use("/test", (req, res) => {
    res.send("Hello, World");
});


// app.use("/", (req, res) => {
//   res.send("first respo nse");
// });

app.listen(3000, () => { 
    console.log('Server is running on port 3000');

})

