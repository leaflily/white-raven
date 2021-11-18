require("dotenv").config();
const nodemailer = require('nodemailer');
const template = require('./template');

function send({to, from, subject, subtitle, body, sendersName, sendersName}) {

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    if (!user || !pass) {
        console.error("GMAIL_USER and/or GMAIL_PASS env not set!");
        return
    }

    if (!to) {
        to = user;
    }
    if (!from) {
        from = user;
    }
    else if (to === user) {
        console.warn('service/mailer.send: to and from not set');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass
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