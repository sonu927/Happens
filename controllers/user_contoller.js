const User = require('../models/user');

module.exports.profile = function(req,res){
    User.findById(req.params.id).then((user)=>{
        return res.render('user_profile',{
            title: user.name,
            profile_user: user
        });
    });
}

//go to sign up page
module.exports.signup = function(req,res){
    return res.render('user_signup',{
        title: 'Sign Up'
    });
}

//go to sign in page
module.exports.signin = function(req,res){
    return res.render('user_signin',{
        title: 'Sign In'
    });
}

//to create a user in db
module.exports.create = function(req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            return User.create(req.body).then((createdUser) => {
                // Save the created user object
                if(createdUser.avatar ==''){
                    createdUser.avatar = 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg';
                }
                return createdUser.save();
            }).then(() => {
                return res.redirect('/users/signin');
            });
        } else {
            return res.redirect('back');
        }
    }).catch((err) => {
        console.log("Error in creating the user: ", err);
        return res.redirect('/');
    });
}

//to create session for the logged in user
module.exports.createSession = function(req,res){
    //find the user
    User.findOne({email: req.body.email}).then((user)=>{
        if(user){
            if(req.body.password != user.password){
                return res.redirect('back');
            }
            return res.redirect('/users/profile/'+user.id);
        }
    })
}

//next to do is upload profile pic when signin up