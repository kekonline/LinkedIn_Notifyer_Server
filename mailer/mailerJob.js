const nodemailer = require('nodemailer');
const User = require("../models/User.model")
const SearchTerm = require('../models/SearchTerm.model');
require("dotenv").config();
// const JobListing = require('../models/JobListing.model');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILPASS
    }
});

const composesedHTML = (unseenJobListings) => {
    let message = "";

    message += `<p>Hi there!</p>`;
    message += `<p>You have ${unseenJobListings.length} new jobs:</p>`;

    unseenJobListings.forEach(job => {
        message += `<h3>${job.title} at ${job.company}</h3>`;
        message += `<div>${job.description}</div>`;
        message += `<p><a href="${job.jobURL}">Link to job</a></p><br>`;
    });

    return message;
};

const mailOptions = (sendTo, subject, message) => ({
    from: process.env.GMAILUSER,
    to: sendTo,
    subject: subject,
    html: message,
});


const getEmailsToSend = async () => {

    try {
        const users = await User.find({ email: { $exists: true, $ne: null }, getNotifications: true })
            .select('email seenJobListings')
            .sort('email'); // Sort users by email

        if (!users || users.length === 0) {
            return [];
        }

        let usersWithUnseenJobListings = [];

        for (const user of users) {
            const searchTerms = await SearchTerm.find({ users: user._id })
                .populate({
                    path: 'jobListings',
                    select: '-users'
                });

            let jobListings = searchTerms.flatMap(term => term.jobListings);

            const seenJobIds = user.seenJobListings
                .filter(item => item.seen)
                .map(item => item.jobListing.toString());

            const unseenJobListings = jobListings.filter(job => !seenJobIds.includes(job._id.toString()));

            if (unseenJobListings.length > 0) {
                usersWithUnseenJobListings.push({
                    email: user.email,
                    unseenJobListings
                });
            }
        }

        return usersWithUnseenJobListings

    } catch (error) {
        console.log(error)
    }

}

const sendJobsMail = async () => {

    const usersWithUnseenJobListings = await getEmailsToSend()
    // console.log(usersWithUnseenJobListings[0].unseenJobListings[0])

    // return

    try {
        usersWithUnseenJobListings.forEach(user => {

            transporter.sendMail(mailOptions(user.email, 'New Job!', composesedHTML(user.unseenJobListings)), (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Email sent: ' + info.response);
            });

        })
    } catch (error) {
        console.log(error)
    }

}

const sendMail = async (sentoTo, subject, message) => {

    try {

        transporter.sendMail(mailOptions(sentoTo, subject, message), (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email sent: ' + info.response);
        });


    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    sendJobsMail,
    sendMail
};