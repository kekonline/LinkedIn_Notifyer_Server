"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const JobListing = require('../models/JobListing.model');
const SearchTerm = require('../models/SearchTerm.model');
const User = require("../models/User.model");
exports.getAllJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.payload._id;
    const page = req.params.page;
    try {
        // const searchTerms = await SearchTerm.find({ users: userId })
        //     .populate({
        //         path: 'jobListings',
        //         select: '-users'
        //     });
        // const jobListings = searchTerms.flatMap(term => term.jobListings);
        // jobListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // if (page === 'unseen') {
        //     const user = await User.findById(userId).select('seenJobListings');
        //     console.log("user", user);
        //     const seenJobIds = user.seenJobListings
        //         .filter(item => page === 'seen' ? item.seen : null)
        //         .map(item => item.jobListing.toString());
        //     jobListings = jobListings.filter(job => seenJobIds.includes(job._id.toString()));
        // }
        // return res.status(200).json(jobListings);
        const searchTerms = yield SearchTerm.find({ users: userId })
            .populate({
            path: 'jobListings',
            select: '-users' // Exclude the 'users' field from the job listings
        });
        let jobListings = searchTerms.flatMap(term => term.jobListings);
        jobListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const user = yield User.findById(userId).select('seenJobListings');
        // console.log("user", user);
        if (page === 'starred') {
            const starredIds = user.seenJobListings
                .filter(item => item.starred) // Only keep stared job listings
                .map(item => item.jobListing.toString());
            jobListings = jobListings.filter(job => starredIds.includes(job._id.toString()));
        }
        else {
            const seenJobIds = user.seenJobListings
                .filter(item => item.seen) // Only keep seen job listings
                .map(item => item.jobListing.toString());
            if (page === 'new') {
                // Return only unseen job listings
                jobListings = jobListings.filter(job => !seenJobIds.includes(job._id.toString()));
            }
            else if (page === 'seen') {
                // Return only seen job listings
                jobListings = jobListings.filter(job => seenJobIds.includes(job._id.toString()));
            }
        }
        return res.status(200).json(jobListings);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching job listings' });
    }
});
// Handler for creating a new job listing
exports.getJobById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const jobId = req.params.jobId;
    try {
        const jobListing = yield JobListing.findById(jobId).select('-users');
        if (!jobListing) {
            return res.status(404).json({ error: 'Job listing not found' });
        }
        // console.log(jobListing);
        res.status(200).json(jobListing);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the job listing' });
    }
});
// Handler for creating a new job listing
exports.markJobId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.payload._id;
    const jobId = req.params.jobId;
    const { markAs } = req.body;
    try {
        const updatedUser = yield User.findOneAndUpdate({
            _id: userId,
            "seenJobListings.jobListing": jobId // Check if the jobListing already exists
        }, {
            $set: {
                [`seenJobListings.$.${markAs}`]: true, // Set seen based on markAs value
            }
        }, {
            new: true,
            upsert: false // Only update if it exists, don't create new if not found
        });
        // If the jobListing doesn't exist, push it to the seenJobListings array
        if (!updatedUser) {
            yield User.findByIdAndUpdate(userId, {
                $push: {
                    seenJobListings: {
                        jobListing: jobId,
                        [markAs]: true,
                    }
                }
            }, { new: true });
        }
        res.status(200).json({ message: 'Job listing updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the job listing' });
    }
});
