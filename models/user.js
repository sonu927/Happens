const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
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

const User = mongoose.model('User',userSchema);
module.exports = User;