const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 2,
      maxlength: 50,
    },
    age: {
      type: Number,
      required: true,
      min: [1, "Age must be at least 1"],
      max: [100, "Age must be less than or equal to 100"],
    },
    course: {
      type: String,
      enum: ["BSIT", "BSCS", "BMMA", "BSEDU"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", StudentSchema);
