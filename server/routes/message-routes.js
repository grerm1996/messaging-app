const express = require('express')
const router = express.Router()
const { getMessages, postMessage } = require('../controllers/message-controller.js')
const passport= require('passport')



router.get('/:convoId', getMessages);
router.post('/:convoId', postMessage);

module.exports = router