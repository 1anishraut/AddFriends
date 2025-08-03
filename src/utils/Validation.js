const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Enter valid name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter valid Email Id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter Strong Password");
  }
};

const validatePasswordOnly = (password) => {
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Enter Strong Password (Min 8 chars, uppercase, lowercase, number, symbol)"
    );
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "gender", "age", "about", "skills"]
  const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field))
  return isEditAllowed

}

module.exports= {validateSignupData, validateEditProfileData ,validatePasswordOnly}