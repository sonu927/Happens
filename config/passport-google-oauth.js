const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
        clientID: '525672971856-deguf5ur0mfh50m3j4hng6da9edps317.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:8000/users/auth/google/callback'
    },

    function(accessToken,refreshToken,profile,done){
        //find user
        User.findOne({email: profile.emails[0].value}).then((user)=>{
            console.log(profile);
            if(user){
                //if found , let this user as req.user
                return done(null,user);
            }else{
                //if not found , create the user and let it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                    avatar: profile.photos[0].value
                }).then((createdUser)=>{
                    return done(null,createdUser);
                }).catch((err)=>{
                    console.log('Error in creating the user');
                    return;
                });
            }
        }).catch((err)=>{
            console.log('error in passport google-strategy');
            return;
        });
    }

));

module.exports = passport;