const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const PHOTO_PATH = path.join('/uploads/users/post_pics');

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
},{
    timestamps: true
});

//handles the images uploaded
let storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'..',PHOTO_PATH));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

postSchema.statics.uploadedPhoto = multer({storage: storage}).single('photo');
postSchema.statics.photoPath = PHOTO_PATH;

const Post = mongoose.model('Post',postSchema);

module.exports = Post;