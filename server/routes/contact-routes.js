const express = require("express");
const router = express.Router();
const {
  addContact,
  removeContact,
} = require("../controllers/contact-controller.js");
const { checkAuthenticated } = require("../controllers/message-controller.js");
const { Users } = require("../models");

router.put("/add/:userId", checkAuthenticated, addContact);

router.put("/remove/:userId", checkAuthenticated, removeContact);

module.exports = router;
