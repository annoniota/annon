const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/login");
    console.log("connected");
  } catch (e) {
    console.log(`Error${e}`);
    process.exit(1);
  }
};

module.exports = connectDb;
