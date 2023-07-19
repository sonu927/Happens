const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/user_contoller');

router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.get('/signup',usersController.signup);
router.get('/signin',usersController.signin);
router.post('/create',usersController.create);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/signin'}
),usersController.createSession);

router.get('/signout',usersController.destroySession);

router.post('/update/:id',passport.checkAuthentication,usersController.update);

//google authentication
router.get('/auth/google',passport.authenticate('google',{scope: ['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/signin'}),usersController.createSession);

//github authentication
router.get('/auth/github',
  passport.authenticate('github', { scope: ['profile','email'] }));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  usersController.createSession);

module.exports = router;