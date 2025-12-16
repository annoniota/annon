const UserAccount = require("../models/useraccounts");
const bcrypt = require("bcrypt");

exports.registerForm = (req, res) => {
  res.render("registration");
};

exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserAccount({ username, password: hashedPassword });

    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.loginForm = (req, res) => {
  res.render("login");
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserAccount.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.userId = user._id;
      return res.redirect("/users");
    }

    res.status(401).json({ message: "Invalid username or password" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
};
