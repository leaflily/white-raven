const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const mailer = require('./service/mailer');

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({ extended: true }));


// send message
app.post('/api/emailmessage', async function (req, res) {
    try {
        const { name, email, message } = req.body
        if (!name || !email || !message) {
            console.warn(`api/send-message missing some values ${{ name, email, message }}`)
        }
        const subject = 'White Raven Message - from '+name;
        const subtitle = 'Message - from '+name;
        const body = message;
        mailer.send({from: email, subject, subtitle, body, sendersName: name, sendersEmail: email});
    }
    catch (e) {
        res.status(500).send({errors: ["Unable to send email, please try again later", e.message]});
    }
})

// send query
app.post('/api/emailquery', async function (req, res) {
    try {
        const { name, email, query } = req.body
        if (!name || !email || !query) {
            console.warn(`api/send-message missing some values ${{ name, email, query }}`)
        }
        const subject = `White Raven Q&A - ${name} asks...`;
        const subtitle = `Q&A - ${name} asks...`;
        const body = query;
        mailer.send({from: email, subject, subtitle, body, sendersName: name, sendersEmail: email});
    }
    catch (e) {
        res.status(500).send({errors: ["Unable to send email, please try again later", e.message]});
    }
})

// make booking 


// get captcha

// submit captcha


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