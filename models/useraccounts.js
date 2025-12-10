const mongoose = require("mongoose");

const userAccountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("UserAccount", userAccountSchema);
