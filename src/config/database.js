const mongoose = require("mongoose")



const connectDB = async () => {
    await mongoose.connect(
      "mongodb+srv://anishraut555:KGW5v4qNR9qy8Tf4@nodejs-project01.s9u1dpk.mongodb.net/devTinder"
    );
}

module.exports = connectDB
