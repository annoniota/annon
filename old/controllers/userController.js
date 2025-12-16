const User = require("../models/User");
const bcrypt = require("bcrypt");
module.exports.showLogin = (req, res) => {
  res.render("login", { fd: {}, error: null });
};

module.exports.processLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const isM = bcrypt.compareSync(password, user.password);
    if (user && isM) {
      req.session.uid = user._id;
      console.log("here right?");
      return res.redirect("/user/home");
    }
    return res.render("login", {
      fd: req.body,
      error: "Invalid email or password",
    });
  } catch (e) {
    res.render("login", { fd: req.body, error: e });
  }
};

module.exports.showRegister = (req, res) => {
  res.render("register", { fd: {}, error: null });
};

module.exports.processRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!password) throw "Password shouldn't be empty";

    const user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });
    await user.save();
    res.render("login", { fd: {}, error: null });
  } catch (e) {
    res.render("register", { fd: req.body, error: e });
  }
};

module.exports.home = async (req, res) => {
  const users = await User.find();
  console.log(`users ${users}`);
  res.render("home", { users });
};

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/user/login");
};
