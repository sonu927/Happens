const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message_controller');

router.post('/messages',messageController.fetchMessages);

module.exports = router;