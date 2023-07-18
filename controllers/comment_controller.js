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

        if(req.xhr){
            return res.status(200).json({
                data: {
                    comment: comment
                },
                message: "Comment Created"
            });
        }

        req.flash('success','comment added!!!')
        return res.redirect('back');
    }
}

//to delete a comment
module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(req.user.id == comment.user){
            let post_id = comment.post;

            comment.deleteOne();

            await Post.findByIdAndUpdate(post_id,{$pull: {comments:req.params.id}} );

            req.flash('success','comment deleted!!!');
            return res.redirect('back');
        }else{
            req.flash('success','error in deleting the comment!!!');
            return res.redirect('back');
        }

    }catch(err){
        console.log('error in deleting the comment : ',err);
        res.status(500).send('error deleting the comment');
    }
}