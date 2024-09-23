


const nodemailer = require('nodemailer');

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// Email options
const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient@example.com',
    subject: 'Test Email',
    text: 'Hello, this is a test email sent using Nodemailer!'
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Email sent: ' + info.response);
});

const sendMails = async () => { }

module.exports = {
    sendMails
};