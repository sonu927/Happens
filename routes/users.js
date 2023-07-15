const express = require('express');
const router = express.Router();

const usersController = require('../controllers/user_contoller');

router.get('/profile/:id',usersController.profile);
router.get('/signup',usersController.signup);
router.get('/signin',usersController.signin);
router.post('/create',usersController.create);
router.post('/create-session',usersController.createSession);

module.exports = router;