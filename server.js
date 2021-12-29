const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const mailer = require('./service/mailer');
const uploader = require('./service/uploader');

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sanitiseData = (obj) => {
    const output = {};
    Object.entries(obj).forEach(([key, value]) => output[key] = DOMPurify.sanitize(value));
    return output
}

// send message
app.post('/server/message', function (req, res) {
    try {
        console.log(req.body)
        const { name, email, message } = sanitiseData(req.body)

        if (!name || !email || !message) {
            console.warn(`server/message missing some values. Sending anyway.`)
        }
        const subject = 'White Raven Message - from '+name;
        const subtitle = 'Message - from '+name;
        const body = (newLine) => message;
       // mailer.send({subject, subtitle, body, sendersName: name, sendersEmail: email});

        // send confirmation


        res.status(200).send()
        return
    }
    catch (e) {
        res.status(500).send({errors: ["Unable to send email, please try again later", e.message]});
    }
})

// send query
app.post('/server/query', async function (req, res) {
    try {
        const { name, email, query } = sanitiseData(req.body)
        if (!name || !email || !query) {
            console.warn(`server/query missing some values ${{ name, email, query }}. Sending anyway.`)
        }
        const subject = `White Raven Q&A - ${name} asks...`;
        const subtitle = `Q&A - ${name} asks...`;
        const body = (newLine) => query;
        mailer.send({subject, subtitle, body, sendersName: name, sendersEmail: email});
    }
    catch (e) {
        res.status(500).send({errors: ["Unable to send email, please try again later", e.message]});
    }
})

// upload photo
app.post('/server/photoUpload', uploader.photoUpload)

// make booking 
app.post('/server/booking', async function (req, res) {
    try {
        const { photoName, name, age, ageValue, gender, reason, otherQuestions, clientName, clientEmail, clientNumber, quietTimes, services } = sanitiseData(req.body)
        if (!name || !email || !query) {
            console.warn(`server/booking missing some values ${{ name, email, query }}. Sending anyway.`)
        }
        const subtitle = `Booking for ${name} with ${clientName}`;
        const subject = `White Raven - ${subtitle}`;

        const body = (newLine) => `
            Booking for: ${services} ${newLine} 
            Animal Name: ${name} ${newLine} 
            Gender: ${gender} ${newLine} 
            Age: ${age} ${agevalue} ${newLine}
            Quiet at: ${quietTimes} ${newLine} 
            Reason for Communication: ${reason} ${newLine} ${newLine}

            Other Questions: ${otherquestions} ${newLine} ${newLine}

        `;
        const sendersContactInfo = `${clientEmail ? clientEmail : ''}${clientEmail & clientNumber ? ' | ' : ''}${clientNumber ? clientNumber : ''}`;
        mailer.send({subject, subtitle, body, sendersName: clientName, sendersEmail: sendersContactInfo});
    }
    catch (e) {
        res.status(500).send({errors: ["Unable to send email, please try again later", e.message]});
    }
})

// get captcha
app.get('/server/captcha', async function (req, res) {
    
})

// submit captcha
app.post('/server/captcha', async function (req, res) {
    
})

if (process.env.NODE_ENV === 'production') {  
    app.use(express.static(path.join(__dirname, 'client/build')));  
    app.get('*', (req, res) => { res.sendFile(path.join(__dirname = 'client/build/index.html')); });
}
else {
    app.get('*', (req, res) => { res.sendFile(path.join(__dirname+'/client/public/index.html')); });
}

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});