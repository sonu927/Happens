const User = require('../models/user');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const nodeMailer = require('../mailers/reset_password_mailer');

module.exports.profile = async function(req,res){
    let posts = await Post.find({user: req.params.id}).sort('-createdAt')
    .populate('user').populate({
        path:'comments',
        populate: [
            { path: 'user' }, // Populate 'user' field inside 'comments'
            { path: 'likes' } // Populate 'likes' field inside 'comments'
        ]
    }).populate('likes');
    User.findById(req.params.id).then((user)=>{
        
        return res.render('user_profile',{
            title: user.name,
            profile_user: user,
            all_posts: posts
        });
    });
}

//go to sign up page
module.exports.signup = async function(req,res){
    if(req.isAuthenticated()){
        let user = await User.findOne({email: req.body.email});
        return res.redirect('/users/profile'+user.id);
    }
    return res.render('user_signup',{
        title: 'Sign Up'
    });
}

//go to sign in page
module.exports.signin = async function(req,res){
    if(req.isAuthenticated()){
        let user = await User.findOne({email: req.body.email});
        return res.redirect('/users/profile'+user.id);
    }
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
           

            User.uploadedAvatar(req,res,function(err){
                if(err){console.log('****Multer error: ',err);}

                User.create(req.body).then((createdUser)=>{
                    if(req.file){
                        createdUser.avatar = User.avatarPath+'/'+req.file.filename;
                    }

                    if(createdUser.avatar ==''){
                        createdUser.avatar = 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg';
                    }
                    return createdUser.save();
                }).then(()=>{

                    return res.redirect('/users/signin');
                });
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
module.exports.createSession = async function(req,res){
    
    // let user = await User.findOne({email: req.body.email});
    req.flash('success','Logged in Successfully');

    return res.redirect('/home');
}

//to sign out 
module.exports.destroySession = function(req,res){
    req.logout(function(err) {
        if (err) {
          console.log('Error in logging out:', err);
          return res.redirect('/'); // Handle the error by redirecting to the homepage or an error page
        }

       
        req.flash('success', 'You have logged out');
        return res.redirect('/');
    });
}

//to update user profile
module.exports.update = async function(req,res){
    
    let user = await User.findById(req.params.id);

    User.uploadedAvatar(req,res,function(err){
        if(err){console.log("****Multer error in profile updation");}

        user.name = req.body.name;
        user.email = req.body.email;

        if(req.file){
            if(user.avatar == 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'){
                user.avatar = User.avatarPath+'/'+req.file.filename;
                user.save();
                return res.redirect('back');
            }
            if(user.avatar){
                fs.unlinkSync(path.join(__dirname,'..',user.avatar));
            }
            
            user.avatar = User.avatarPath+'/'+req.file.filename;
        }

        user.save();
        return res.redirect('back');
    });
}

//to open the reset password page
module.exports.resetPassword = function(req,res){
    return res.render('reset_password',{
        access: false,
        title: 'Happens | Reset Password'
    });
}

//send reset password mail
module.exports.mailResetPass = async function(req,res){
    try{

        let user = await User.findOne({email: req.body.yourEmail});

        if(user){
            if(user.isTokenValid == false){
                user.accessToken = crypto.randomBytes(30).toString('hex');
                user.isTokenValid = true;
                user.save();
            }

            nodeMailer.setPassword(user);

            req.flash('success','Reset password mail sent');
            return res.redirect('/');

        }

    }catch(err){
        console.log('Error in reset mail :', err);
        return;
    }
}

module.exports.setPassword = async function(req,res){
    try{
        let user = await User.findOne({
            accessToken: req.params.accessToken
        });

        if(user){
            return res.render('reset_password',{
                access: true,
                accessToken: req.params.accessToken,
                title: 'Happen | Reset Password'
            });
        }else{
            console.log('user not found');
            return res.redirect('/');
        }

    }catch(err){
        console.log('error: ',err);
        return;
    }
}

module.exports.updatePassword = async function(req,res){
    try{
        let user = await User.findOne({
            accessToken: req.params.accessToken
        });

        if(user){
            if(user.isTokenValid){
                if(req.body.newPassword == req.body.confirmPassword){
                    user.password = req.body.newPassword;
                    user.isTokenValid = false;
                    user.save();
                    req.flash('success','Password changed successfully');
                    return res.redirect('/users/signin');
                }else{
                    console.log("Opps!! Password don't match");
                    return res.redirect('back');
                }
            }
        }

    }catch(err){
        console.log('error in update password function :',err);
        return;
    }
}