require("dotenv").config();
const nodemailer = require('nodemailer');
const template = require('./template');

function send({to, from, subject, subtitle, body, sendersName, sendersName}) {

    const user = process.env.GMAIL_USER;
    const id = process.env.GMAIL_CLIENT_ID;
    const secret = process.env.GMAIL_CLIENT_SECRET;

    if (!user || !id || !secret) {
        console.error("GMAIL_USER and/or GMAIL_CLIENT_ID and/or GMAIL_CLIENT_SECRET env not set!");
        return
    }

    if (!to) {
        to = user;
    }
    // if (!from) {
        from = user; // Gmail restricts changing this
    // }
    else if (to === user) {
        console.warn('service/mailer.send: to and from not set');
    }

    // Set up token:
    // - goto https://console.cloud.google.com/apis/dashboard
    // - Credentials
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          type: 'OAuth2',
          user,
          clientId: id, 
          clientSecret: secret,
          // refreshToken: '1/XXxXxsss-xxxXXXXXxXxx0XXXxxXXx0x00xxx',
          // accessToken: 'ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x',
          // expires: 1484314697598
      }
    });

    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true,
    //   auth: {
    //       type: 'OAuth2',
    //       user: 'user@example.com'
    //   }
    // });
  
    // transporter.set('oauth2_provision_cb', (user, renew, callback)=>{
    //     let accessToken = userTokens[user];
    //     if(!accessToken){
    //         return callback(new Error('Unknown user'));
    //     }else{
    //         return callback(null, accessToken);
    //     }
    // });
        
    const mailOptions = {
      from,
      to,
      subject: subject,
      text: `
        ${subtitle ? `${subtitle}\r\n\r\n` : ''}
        ${body ? `${body('\r\n')}\r\n\r\n` : ''}
        ${sendersName ? `${sendersName}\r\n` : ''}
        ${sendersEmail ? `${sendersEmail}\r\n` : ''}
      `,
      html: template(subtitle, body('<br />'), sendersName, sendersEmail)
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

exports.send = send