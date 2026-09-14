const express = require("express");
const router = express.Router();
const {
  createUser,
  deleteUser,
  updateUserStatus,
  getUsersStatusBatch,
  login,
  logout,
  validateSession,
} = require("../controllers/auth.controllers");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

router.post("/user", authenticate, authorize("administrador"), createUser);
router.delete(
  "/user/:id",
  authenticate,
  authorize("administrador"),
  deleteUser,
);
router.patch(
  "/user/:id/status",
  authenticate,
  authorize("administrador"),
  updateUserStatus,
);
router.post(
  "/users/status-batch",
  authenticate,
  authorize("administrador"),
  getUsersStatusBatch,
);
router.post("/login", login);
router.post("/logout", logout);
router.get("/validate-session", validateSession);

module.exports = router;
