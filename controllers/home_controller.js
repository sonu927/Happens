const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){

    if(req.user){
        let posts = await Post.find({user: req.user._id})
        .sort('-createdAt')
        .populate('user').populate({
            path:'comments',
            populate:{
                path: 'user'
            }
        });

        let all_users = await User.find({});

        return res.render('home',{
            title: 'Home',
            posts: posts,
            users: all_users
        });
    }

    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path: 'user'
        }
    });


    return res.render('home',{
        title: 'Home',
        posts: posts
    });
}