const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const requireLogin = (req, res, next) => {
  if (!req.session.userId) return res.redirect("/login");
  next();
};

router.get("/new", userController.newForm);

router.post("/", userController.createUser);

router.get("/", requireLogin, userController.getAllUsers);

router.get("/:id", userController.getUser);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;
