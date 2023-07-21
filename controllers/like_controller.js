const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');


module.exports.toggleLike = async function(req,res){
    try{

        let likeable;
        let deleted = false;
        let react = req.query.reaction;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        if(existingLike){
            //if like exist delete it
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.deleteOne();
            deleted = true;
        }else{
            let newLike = await Like.create({
                likeable: req.query.id,
                onModel: req.query.type,
                user: req.user._id,
                reaction: req.query.reaction
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message: 'Request Successful',
            data:{
                deleted: deleted,
                reaction: react,
                id: req.query.id
            }
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}