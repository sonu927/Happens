const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function(req,res){

    Post.uploadedPhoto(req,res,function(err){
        if(err){console.log("***Multer error in post :",err);}

        Post.create({
            caption: req.body.caption,
            user: req.user._id
        }).then((createdPost)=>{
            if(req.file){
                createdPost.photo = Post.photoPath + '/' + req.file.filename;
                
            }
            return createdPost.populate('user');
        }).then((populatedPost)=>{
            populatedPost.save();
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post: populatedPost
                    },
                    message: "Post Created"
                });
            }

            req.flash('success','Post Uploaded');
            return res.redirect('back');
        });


    });
}

//to delete a post 
module.exports.destroy = async function(req,res){
    try{
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            post.deleteOne();

            await Comment.deleteMany({post: req.params.id});

            req.flash('success','Post deleted!!');
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }

    }catch(err){
        console.log('Error in deleting the post:',err);
        res.status(500).send('Error deleting post');
    }
}