const express = require("express");
const router = express.Router();
const {
  createUser,
  login,
  logout,
} = require("../controllers/auth.controllers");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

router.post("/user", authenticate, authorize("administrador"), createUser);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
