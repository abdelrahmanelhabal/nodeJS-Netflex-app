const mongoose = require("mongoose");

const userShema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "UserName is required"],
      unique: [true, "UserName must be unidue"],
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      unique: [true, "Email must be unidue"],
    },
    password: {
      type: String,
      require: [true, "Password is required"],
      unique: [true, "Password must be unidue"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userShema);
