const express = require("express");
const connectDB = require("./db/connection");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

connectDB();

app.use("/students", studentRoutes);

app.get("/", (req, res) => {
  res.redirect("/students");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
