const express = require('express')
const router = express.Router()
const { addContact } = require('../controllers/contact-controller.js')
const { Users } = require("../models");



router.put('/add/:userId', addContact);

module.exports = router