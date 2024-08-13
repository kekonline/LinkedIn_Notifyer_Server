const JobListing = require('../models/JobListing.model');
const SearchTerm = require('../models/SearchTerm.model');

exports.getAllJobs = async (req, res, next) => {
    const userId = req.payload._id;

    try {
        const searchTerms = await SearchTerm.find({ users: userId })
            .populate({
                path: 'jobListings',
                select: '-users'
            });

        const jobListings = searchTerms.flatMap(term => term.jobListings);
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
