const Post = require('../models/post');

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
            return createdPost.save();
        }).then(()=>{
            req.flash('success','Post Uploaded');
            return res.redirect('back');
        });

    });

    
}