const nodeMailer = require('../config/nodemailer');

exports.setPassword = (user)=>{
    let htmlString = nodeMailer.renderTemplate({user : user},'/users/set_password.ejs');

    nodeMailer.transporter.sendMail({
        from: 'sonu16122001@gmail.com',
        to: user.email,
        subject: 'Reset Password Mail',
        html: htmlString
    },(err,info)=>{
        if(err){
            console.log('error in sending the mail',err);
            return;
        }

        console.log('Mail sent',info);
        return;
    });
}