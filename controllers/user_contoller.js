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
            // return User.create(req.body).then((createdUser) => {
            //     // Save the created user object
            //     if(createdUser.avatar ==''){
            //         createdUser.avatar = 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg';
            //     }
            //     return createdUser.save();
            // }).then(() => {
            //     return res.redirect('/users/signin');
            // });

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
    
    let user = await User.findOne({email: req.body.email});
    req.flash('success','Logged in Successfully');

    return res.redirect('/');
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