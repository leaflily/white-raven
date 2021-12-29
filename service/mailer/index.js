require("dotenv").config();
const nodemailer = require('nodemailer');
const { template } = require('./template');

console.log({template})

function send({to, subject, subtitle, body, sendersName, sendersEmail}) {

    const user = process.env.GMAIL_USER;
    const id = process.env.GMAIL_CLIENT_ID;
    const secret = process.env.GMAIL_CLIENT_SECRET;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
    const accessToken = process.env.GMAIL_ACCESS_TOKEN;

    if (!user || !id || !secret) {
        console.error("GMAIL_USER and/or GMAIL_CLIENT_ID and/or GMAIL_CLIENT_SECRET env not set!");
        return
    }

    if (!to) {
        to = user;
    }
    from = user; 

    // Set up token:
    // - goto https://console.cloud.google.com/apis/dashboard
    // - Activate email api and get Credentials ID and secret
    // - get refresh token using https://developers.google.com/oauthplayground as described on https://stackoverflow.com/questions/24098461/nodemailer-gmail-what-exactly-is-a-refresh-token-and-how-do-i-get-one
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          type: 'OAuth2',
          user,
          clientId: id, 
          clientSecret: secret,
          refreshToken,
          accessToken
      }
    });
        
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