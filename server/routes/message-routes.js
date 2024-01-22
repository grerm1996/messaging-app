const express = require("express");
const router = express.Router();
const {
  checkAuthenticated,
  getMessages,
  getAllMessages,
  postMessage,
  markAsRead,
} = require("../controllers/message-controller.js");
const passport = require("passport");

// router.get("/:convoId", checkAuthenticated, getMessages);
router.get("/:user", checkAuthenticated, getAllMessages);
router.post("/:convoId", checkAuthenticated, postMessage);
router.put("/:convoId", checkAuthenticated, markAsRead);

module.exports = router;
