const Message = require('../models/message');

module.exports.fetchMessages = async function(req,res){
    const curr_user = req.user.id;
    const friend_user = req.query.fid;

    try{
        const messages = await Message.find({
            $or: [
                {sender: curr_user,receiver: friend_user},
                {sender: friend_user, receiver: curr_user}
            ]
        })
        .sort({timestamp: 1})
        .populate('sender')
        .populate('receiver');
    
        //console.log(messages);

        if(req.xhr){
            return res.status(200).json({
                message: 'all old message found',
                data:{
                    userEmail: req.user.email,
                    messages: messages
                }
            });
        }
    
        
    }catch(err){
        console.log('error in finding old messages');
    }
    

}