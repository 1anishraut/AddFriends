const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || lastName) {
    throw new Error("Enter valid name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter valid Email Id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter Strong Password");
  }
};

module.exports= {validateSignupData,}