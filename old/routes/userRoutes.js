const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const protect = (req, res, next) => {
  if (!req.session.uid) {
    return res.redirect("/user/login");
  }
  next();
};

router.get("/login", userController.showLogin);
router.post("/login", userController.processLogin);
router.get("/register", userController.showRegister);
router.post("/register", userController.processRegister);
router.get("/home", protect, userController.home);
router.get("/logout", userController.logout);
module.exports = router;
