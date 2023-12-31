const express = require("express");
const router = express.Router();
const {
  postlogin,
  validateRegister,
  authenticateLogin,
  checkNotAuthenticated,
  register,
  sendUser,
  logout,
} = require("../controllers/login-controller.js");
const passport = require("passport");

router.post("/", checkNotAuthenticated, postlogin);

router.post("/register", validateRegister, checkNotAuthenticated, register);

router.delete("/logout", logout);

router.get("/user", sendUser);

module.exports = router;
