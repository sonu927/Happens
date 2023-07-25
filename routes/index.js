const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');
const messageController = require('../controllers/message_controller');

router.get('/',homeController.home);
router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
router.use('/likes',require('./likes'));
//router.use('/chat',require('./messages'));

router.post('/chat/messages',messageController.fetchMessages);

module.exports = router;