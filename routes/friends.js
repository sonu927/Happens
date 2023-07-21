const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friend_controller');

router.get('/add/:id',friendsController.add);
router.get('/cancel/:id',friendsController.cancel);
router.get('/reject/:id',friendsController.reject);
router.get('/accept/:id',friendsController.accept);
router.get('/unfriend/:id',friendsController.unfriend);

module.exports = router;