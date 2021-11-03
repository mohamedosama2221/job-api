const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = mongoose.Schema({
  email: {
    type: String,
    require: [true, "email can't be empty"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email address",
    ],
    unique: [true, "this email is already in use"],
  },
  name: {
    type: String,
    require: [true, "name can't be empty"],
    minlength: [5, " name can't be less than 5 characters"],
    maxlength: [20, " name can't exceed 20 characters"],
  },
  password: {
    type: String,
    require: [true, "password can't be empty"],
  },
});

User.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

User.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

User.methods.checkPassword = async function (password) {
  const verify = await bcrypt.compare(password, this.password);
  return verify;
};

module.exports = mongoose.model("User", User);
