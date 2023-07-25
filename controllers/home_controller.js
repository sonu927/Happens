const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){

    if(req.user){
        
        let all_users = await User.find({});
        let curr_user = await User.findOne({ _id: req.user._id })
        .populate('requestRecv')
        .populate({
            path: 'friendships',
            populate: [
            { path: 'from_user' },
            { path: 'to_user' }
            ]
        });
        const userAndFriendsIdsSet = new Set([req.user.id]);

        curr_user.friendships.forEach((friendship) => {
            userAndFriendsIdsSet.add(friendship.from_user.id.toString());
            userAndFriendsIdsSet.add(friendship.to_user.id.toString());
        });

        const userAndFriendsIds = Array.from(userAndFriendsIdsSet);

        //console.log(userAndFriendsIds);

        let posts = await Post.find({user: {$in: userAndFriendsIds}})
        .sort('-createdAt')
        .populate('user').populate({
            path:'comments',
            populate:{
                path: 'user'
            },
            populate:{
                path: 'likes'
            }
        }).populate('likes');
        //console.log(curr_user);
        return res.render('home',{
            title: 'Home',
            posts: posts,
            users: all_users,
            curr_user: curr_user
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