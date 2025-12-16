const User = require("../models/User");
const bcrypt = require("bcrypt");

// ============ MIDDLEWARE ============

// Middleware to protect routes
exports.requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};

// Middleware to redirect authenticated users
exports.redirectIfAuth = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect("/users");
  }
  next();
};

// ============ AUTH CONTROLLERS ============

// Show registration form
exports.showRegister = (req, res) => {
  res.render("register", { error: null, formData: {} });
};

// Process registration
exports.processRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render("register", {
        error: "Username or email already exists",
        formData: req.body,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.redirect("/login");
  } catch (err) {
    res.render("register", {
      error: err.message,
      formData: req.body,
    });
  }
};

// Show login form
exports.showLogin = (req, res) => {
  res.render("login", { error: null, formData: {} });
};

// Process login
exports.processLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", {
        error: "Invalid email or password",
        formData: req.body,
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", {
        error: "Invalid email or password",
        formData: req.body,
      });
    }

    // Set session
    req.session.userId = user._id;
    res.redirect("/users");
  } catch (err) {
    res.render("login", {
      error: err.message,
      formData: req.body,
    });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/users");
    }
    res.redirect("/login");
  });
};

// ============ CRUD CONTROLLERS ============

// List all users (Read)
exports.getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.session.userId;
    const users = await User.find().sort({ createdAt: -1 });

    res.render("index", { users, currentUserId });
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
};

// Show single user (Read)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const currentUserId = req.session.userId;
    res.render("show", { user, currentUserId });
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
};

// Show edit form (Update)
exports.showEdit = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Only allow users to edit their own account
    if (user._id.toString() !== req.session.userId) {
      return res.status(403).send("Unauthorized");
    }

    res.render("edit", { user, error: null });
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
};

// Process edit (Update)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Only allow users to edit their own account
    if (user._id.toString() !== req.session.userId) {
      return res.status(403).send("Unauthorized");
    }

    const { username, email, currentPassword, newPassword } = req.body;

    // Update basic info
    user.username = username;
    user.email = email;

    // Update password if provided
    if (newPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.render("edit", {
          user,
          error: "Current password is incorrect",
        });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.redirect("/users/" + user._id);
  } catch (err) {
    const user = await User.findById(req.params.id);
    res.render("edit", {
      user,
      error: err.message,
    });
  }
};

// Delete user (Delete)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Only allow users to delete their own account
    if (user._id.toString() !== req.session.userId) {
      return res.status(403).send("Unauthorized");
    }

    await User.findByIdAndDelete(req.params.id);

    // Destroy session after deleting account
    req.session.destroy();
    res.redirect("/register");
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
};
