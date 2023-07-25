const Message = require('../models/message');

module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer, {
        cors: {
          origin: 'http://localhost:8000',
          methods: ['GET', 'POST'],
          allowedHeaders: ['my-custom-header'],
          credentials: true
        }
    });
      

    io.sockets.on('connection',function(socket){
        console.log('new connection received ',socket.id);

        socket.on('disconnect',function(){
            console.log('socket disconnected');
        });

        socket.on('join_room',function(data){
            console.log('joining request recived..',data);

            socket.join(data.chatRoom);
            io.in(data.chatRoom).emit('user_joined',data);
        });

        socket.on('send_message', async function (data) {
            console.log('Sending message:', data);
            const msg = await Message.create({
                sender: data.sender,
                receiver: data.receiver,
                content: data.message
            });
            io.to(data.chatroom).emit('receive_message', data);
        });
    });


}