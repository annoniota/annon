const express = require("express");
const session = require("express-session");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

app.set("view engine", "ejs");

connectDb();

app.use("/", userRoutes);

app.use((req, res) => {
  res.status(404).render("404");
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

app.listen(3000, () => console.log("Server running on http://localhost:3000/"));
