const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    avatar: {
        type: String,
        default: 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'
    },
    accessToken: {
        type: String,
        default: 'abc'
    },
    isTokenValid: {
        type: Boolean,
        default: false
    },
    friendships:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friendship'
            
        }
    ]
},{
    timestamps:true
});

//handles the images uploaded
let storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

//static methods
userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User',userSchema);
module.exports = User;