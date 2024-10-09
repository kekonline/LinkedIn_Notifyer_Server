import nodemailer from 'nodemailer';
import User from "../models/User.model";
import JobListing from "../models/JobListing.model";
import SearchTerm from '../models/SearchTerm.model';
import dotenv from 'dotenv';
dotenv.config();
// const JobListing = require('../models/JobListing.model');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILPASS
    }
});

const composesedHTML = (unseenJobListings: JobListing[]) => {
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

const mailOptions = (sendTo: string, subject: string, message: string) => ({
    from: process.env.GMAILUSER,
    to: sendTo,
    subject: subject,
    html: message,
});


const getEmailsToSend = async (): Promise<{ email: string, unseenJobListings: JobListing[] }[]> => {
    try {
        const users = await User.find({ email: { $exists: true, $ne: null }, getNotifications: true })
            .select('email seenJobListings')
            .sort('email'); // Sort users by email

        if (!users || users.length === 0) {
            return [];
        }

        let usersWithUnseenJobListings: { email: string, unseenJobListings: JobListing[] }[] = [];

        for (const user of users) {
            if (!user.email) {
                continue;
            }

            // Find search terms and populate full jobListing documents (not just ObjectId references)
            const searchTerms = await SearchTerm.find({ users: user._id })
                .populate({
                    path: 'jobListings',
                    model: 'JobListing', // Ensure this is the correct model
                    select: '-users' // Exclude unnecessary fields if needed
                });

            // Flatten job listings into a single array
            let jobListings: JobListing[] | [] = searchTerms.flatMap(term => term.jobListings as unknown as JobListing[]);

            // Get the user's seen job IDs
            const seenJobIds = user.seenJobListings
                .filter(item => item.seen)
                .map(item => item.jobListing.toString());

            // Filter unseen job listings
            const unseenJobListings = jobListings.filter(job => !seenJobIds.includes(job._id.toString()));

            if (unseenJobListings.length > 0) {
                usersWithUnseenJobListings.push({
                    email: user.email,
                    unseenJobListings
                });
            }
        }

        return usersWithUnseenJobListings;

    } catch (error) {
        console.log(error);
        return [];
    }
};

export const sendJobsMail = async () => {

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

export const sendMail = async (sentoTo: string, subject: string, message: string) => {

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

export default {
    sendJobsMail,
    sendMail
};