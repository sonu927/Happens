

class ChatEngine{
    constructor(chatBoxId,userEmail,userName){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;

        this.socket = io.connect('http://localhost:5000');
        if(this.userEmail){
            this.connectionHandler();
        }
    }



    scrollChatBoxToBottom() {
        var chatBox = document.getElementById("chat-messages-list");
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    connectionHandler(){
        let self = this;
        this.socket.on('connect',function(){
            console.log('connection established using socket....');

            self.socket.on('user_joined',function(data){
                console.log('user joined',data);
            });
        });

        this.socket.on('receive_message', (data)=>{
            console.log('message received',data.message);
            

            let newMessage = $('<li>');

            let messageType = "other-message";

            if(data.senderMail == self.userEmail){
                messageType = "self-message";
            }
            
            newMessage.append($('<p>',{
                'html': data.senderName
            }));
            
            newMessage.append($('<span>',{
                'html': data.message
            }));

            

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);

            this.scrollChatBoxToBottom();
        });


    }

    startChat(friendId){
        const arr = [this.userEmail,friendId];
        arr.sort();
        const room = arr[0]+arr[1];
        this.socket.emit('join_room',{
            user_email: this.userEmail,
            chatRoom: room
        });
        
    }

    displayMessage = (data) => {
        let newMessage = $('<li>');
      
        let messageType = "other-message";
      
        if (data.sender === this.userEmail) {
          messageType = "self-message";
        }
      
        newMessage.append($('<span>', {
          'html': data.message
        }));
      
        newMessage.append($('<sub>', {
          'html': data.sender
        }));
      
        newMessage.addClass(messageType);
      
        this.chatBox.append(newMessage);
      }
      

    sendMessage(message,senderId, friendId,room) {
        const data = {
          senderName: this.userName,
          senderMail: this.userEmail,
          sender: senderId,
          receiver: friendId,
          message: message,
          chatroom: room
        };
        this.socket.emit('send_message', data);
    }
}




