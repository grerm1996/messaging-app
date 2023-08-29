const express = require('express')
const router = express.Router()
const { addContact, removeContact } = require('../controllers/contact-controller.js')
const { Users } = require("../models");



router.put('/add/:userId', addContact);

router.put('/remove/:userId', removeContact);

module.exports = router