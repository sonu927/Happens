const express = require('express');
const router = express.Router();
const post_Controller = require('../controllers/post_controller');

router.post('/create',post_Controller.create);

module.exports = router;