const passport = require('passport');
const githubStrategy = require('passport-github2').Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new githubStrategy({
        clientID: 'ff1bae547dc3e476d401',
        clientSecret: '59d26bc4d3a37ffdf6a4fb86bcee5ff035ba8af7',
        callbackURL: 'http://localhost:8000/users/auth/github/callback'
    },
    function(accessToken, refreshToken, profile, done){
        console.log(profile);
        //find user
        User.findOne({email: profile.emails[0].value}).then((user)=>{
            if(user){
                return done(null,user);
            }else{
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
            console.log('error in passport github-strategy');
            return;
        });
    }
));

module.exports = passport;