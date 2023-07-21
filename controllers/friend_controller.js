const User = require('../models/user');
const Friendship = require('../models/friendships');

//to send a request
module.exports.add = async function(req,res){
    //find user to whom request is send to
    let user = await User.findById(req.params.id);
    //find the user who sent the request
    let curr_user = await User.findById(req.user.id);

    if(!user.requestRecv){
        await User.updateOne({_id: user._id},{$set:{requestRecv:[]}});
    }
    if(!curr_user.pendingReq){
        await User.updateOne({_id: curr_user._id},{$set:{pendingReq:[]}});
    }

    //add request to user whom you send request to
    user.requestRecv.push(req.user._id);

    //add request to the pending request array of the current user
    curr_user.pendingReq.push(user._id);

    user.save();
    curr_user.save();

    return res.redirect('back');
}

//to cancel the request a user sent
module.exports.cancel = async function(req,res){
    //find user to whom request is send to
    let user = await User.findById(req.params.id);
    //find the user who sent the request
    let curr_user = await User.findById(req.user.id);

    user.requestRecv.pull(curr_user._id);

    curr_user.pendingReq.pull(user._id);

    user.save();
    curr_user.save();

    return res.redirect('back');
}

//to reject a friend request
module.exports.reject = async function(req,res){
    //find user to whom request is send to
    let user = await User.findById(req.params.id);
    //find the user who sent the request
    let curr_user = await User.findById(req.user.id);

    user.pendingReq.pull(curr_user._id);

    curr_user.requestRecv.pull(user._id);

    user.save();
    curr_user.save();

    return res.redirect('back');
}

//to accept a friend request
module.exports.accept = async function(req,res){
    //user who is accepting the request
    curr_user = await User.findById(req.user.id);
    //user who sent the request
    from_user = await User.findById(req.params.id);

    let friends = await Friendship.create({
        from_user: from_user._id,
        to_user: curr_user._id
    });

    curr_user.friendships.push(friends);
    from_user.friendships.push(friends);

    curr_user.requestRecv.pull(from_user._id);
    from_user.pendingReq.pull(curr_user._id);

    curr_user.save();
    from_user.save();

    return res.redirect('back');
}

//to unfriend a friend
module.exports.unfriend = async function(req,res){
    curr_user = await User.findById(req.user.id);
    //user you are friends with
    f_user = await User.findById(req.params.id);

    let Op1_friends = await Friendship.findOne({
        from_user: f_user._id,
        to_user: curr_user._id
    });

    let Op2_friends = await Friendship.findOne({
        from_user: curr_user._id,
        to_user: f_user._id
    });

    if(Op1_friends){
        curr_user.friendships.pull(Op1_friends._id);
        f_user.friendships.pull(Op1_friends._id);
        Op1_friends.deleteOne();
    }else{
        curr_user.friendships.pull(Op2_friends._id);
        f_user.friendships.pull(Op2_friends._id);
        Op2_friends.deleteOne();
    }

    curr_user.save();
    f_user.save();

    return res.redirect('back');
}