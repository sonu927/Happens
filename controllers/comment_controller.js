const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req,res){
 
    let post = await Post.findById(req.body.post);

    if(post){
        let comment = await Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
        });

        comment = await Comment.findById(comment._id).populate('user');
        //console.log(comment);

        post.comments.push(comment);
        post.save();
        req.flash('success','comment added!!!')
        return res.redirect('back');
    }
}