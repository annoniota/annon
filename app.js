const express = require("express");
const session = require("express-session");
const app = express();
const userRoute = require("./routes/userRoutes");
const connectDb = require("./config/db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "KEY",
    resave: false,
    saveUninitialized: true,
  })
);
app.set("view engine", "ejs");

app.use("/user", userRoute);
connectDb();

app.use((req, res) => {
  res.render("404");
});

// app.use("/", require("./routes/authRoutes"));

app.listen(3000, () => console.log("Server running on http://localhost:3000/"));
