const JobListing = require('../models/JobListing.model');
const SearchTerm = require('../models/SearchTerm.model');
const User = require("../models/User.model")

exports.getAllJobs = async (req, res, next) => {
    const userId = req.payload._id;
    const { section } = req.query;

    try {
        const searchTerms = await SearchTerm.find({ users: userId })
            .populate({
                path: 'jobListings',
                select: '-users'
            });

        const jobListings = searchTerms.flatMap(term => term.jobListings);

        jobListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


        if (section === 'seen') {
            const user = await User.findById(userId).select('seenJobListings');
            console.log("user", user);
            const seenJobIds = user.seenJobListings
                .filter(item => section === 'seen' ? item.seen : null)
                .map(item => item.jobListing.toString());


            jobListings = jobListings.filter(job => seenJobIds.includes(job._id.toString()));





        }
        return res.status(200).json(jobListings);
        // Default: Return all job listings
        res.status(200).json(jobListings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching job listings' });
    }
};



// Handler for creating a new job listing
exports.getJobById = async (req, res, next) => {
    const jobId = req.params.jobId;

    try {
        const jobListing = await JobListing.findById(jobId).select('-users');

        if (!jobListing) {
            return res.status(404).json({ error: 'Job listing not found' });
        }
        console.log(jobListing);
        res.status(200).json(jobListing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the job listing' });
    }
};
