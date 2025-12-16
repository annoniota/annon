const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// ============ AUTH ROUTES ============
router.get(
  "/register",
  userController.redirectIfAuth,
  userController.showRegister
);
router.post(
  "/register",
  userController.redirectIfAuth,
  userController.processRegister
);

router.get("/login", userController.redirectIfAuth, userController.showLogin);
router.post(
  "/login",
  userController.redirectIfAuth,
  userController.processLogin
);

router.get("/logout", userController.logout);

// ============ CRUD ROUTES (Protected) ============
router.get("/", (req, res) => res.redirect("/users"));
router.get("/users", userController.requireAuth, userController.getAllUsers);
router.get("/users/:id", userController.requireAuth, userController.getUser);
router.get(
  "/users/:id/edit",
  userController.requireAuth,
  userController.showEdit
);
router.post(
  "/users/:id",
  userController.requireAuth,
  userController.updateUser
);
router.post(
  "/users/:id/delete",
  userController.requireAuth,
  userController.deleteUser
);

module.exports = router;
