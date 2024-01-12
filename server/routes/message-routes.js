const express = require("express");
const router = express.Router();
const {
  checkAuthenticated,
  getMessages,
  postMessage,
} = require("../controllers/message-controller.js");
const passport = require("passport");

router.get("/:convoId", checkAuthenticated, getMessages);
router.post("/:convoId", checkAuthenticated, postMessage);

module.exports = router;
