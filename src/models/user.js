const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const bcrpt = require("bcrypt");


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter valid email Id" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong Password" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      maxL: 100,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          // Validate fun will only run when new user data is added || add runValidator
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Enter valid image URL" + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is the default about of the User",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);



userSchema.methods.getJWT = async function () {
  const user = this;
  
  const token = await jwt.sign({ _id: user._id }, "Raut@2000", { expiresIn: "1d" });
  console.log(token);
  
  return token
  
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password

  const isPasswordValid = await bcrpt.compare(passwordInputByUser, passwordHash);

  return isPasswordValid
}


module.exports = mongoose.model("User", userSchema);