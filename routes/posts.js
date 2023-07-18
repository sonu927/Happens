const express = require('express');
const router = express.Router();
const post_Controller = require('../controllers/post_controller');
const passport = require('passport');

router.post('/create',passport.checkAuthentication,post_Controller.create);
router.get('/destroy/:id',passport.checkAuthentication,post_Controller.destroy);

module.exports = router;