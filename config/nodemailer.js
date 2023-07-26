const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');


//this sends the mail, defines how communication is happening
let transporter = nodemailer.createTransport({
    service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'sonu.cs4014@rla.du.ac.in',
            pass: 'rlacs4014'
        }
});

//renders the view file for mails
let renderTemplate = (data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){console.log('error in rendering the template');return}

            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}