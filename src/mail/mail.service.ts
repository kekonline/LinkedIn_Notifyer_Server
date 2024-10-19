import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import nodemailer from 'nodemailer';
import { User } from '../user/schemas/user.schema';
import { JobListing } from '../job-listing/schemas/job-listing.schema';
import { SearchTerm } from '../search-term/schemas/search-term.schema';
import dotenv from 'dotenv';
dotenv.config();



@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAILUSER,
                pass: process.env.GMAILPASS,
            },
        });
    }

    private composeHTML(unseenJobListings: JobListing[]): string {
        let message = `<p>Hi there!</p>`;
        message += `<p>You have ${unseenJobListings.length} new jobs:</p>`;

        unseenJobListings.forEach((job) => {
            message += `<h3>${job.title} at ${job.company}</h3>`;
            message += `<div>${job.description}</div>`;
            message += `<p><a href="${job.jobURL}">Link to job</a></p><br>`;
        });

        return message;
    }

    private mailOptions(sendTo: string, subject: string, message: string) {
        return {
            from: process.env.GMAILUSER,
            to: sendTo,
            subject: subject,
            html: message,
        };
    }

    private async getEmailsToSend(): Promise<{ email: string; unseenJobListings: JobListing[] }[]> {
        try {
            const users = await (User as Model<User>).find({ email: { $exists: true, $ne: null }, getNotifications: true })
                .select('email seenJobListings')
                .sort('email');

            if (!users || users.length === 0) {
                return [];
            }

            const usersWithUnseenJobListings: { email: string; unseenJobListings: JobListing[] }[] = [];

            for (const user of users) {
                if (!user.email) continue;

                const searchTerms = await (SearchTerm as Model<SearchTerm>).find({ users: user._id }).populate({
                    path: 'jobListings',
                    model: 'JobListing',
                    select: '-users',
                });

                const jobListings: JobListing[] = searchTerms.flatMap(
                    (term) => term.jobListings as unknown as JobListing[],
                );

                const seenJobIds = user.seenJobListings
                    .filter((item) => item.seen)
                    .map((item) => item.jobListing.toString());

                const unseenJobListings = jobListings.filter(
                    (job) => !seenJobIds.includes(job._id.toString()),
                );

                if (unseenJobListings.length > 0) {
                    usersWithUnseenJobListings.push({
                        email: user.email,
                        unseenJobListings,
                    });
                }
            }

            return usersWithUnseenJobListings;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    public async sendJobsMail() {
        const usersWithUnseenJobListings = await this.getEmailsToSend();

        try {
            usersWithUnseenJobListings.forEach((user) => {
                const message = this.composeHTML(user.unseenJobListings);

                this.transporter.sendMail(
                    this.mailOptions(user.email, 'New Job!', message),
                    (error, info) => {
                        if (error) {
                            console.error(`Failed to send email to ${user.email}:`, error);
                            return;
                        }
                        console.log(`Email sent to ${user.email}:`, info.response);
                    },
                );
            });
        } catch (error) {
            console.error(error);
        }
    }

    public async sendMail(sendTo: string, subject: string, message: string) {
        try {
            this.transporter.sendMail(
                this.mailOptions(sendTo, subject, message),
                (error, info) => {
                    if (error) {
                        console.error(`Failed to send email to ${sendTo}:`, error);
                        return;
                    }
                    console.log(`Email sent to ${sendTo}:`, info.response);
                },
            );
        } catch (error) {
            console.error(error);
        }
    }
}
