const JobListing = require('../models/JobListing.model');
const SearchTerm = require('../models/SearchTerm.model');
const User = require("../models/User.model")

exports.getAllJobs = async (req, res, next) => {
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
        const searchTerms = await SearchTerm.find({ users: userId })
            .populate({
                path: 'jobListings',
                select: '-users' // Exclude the 'users' field from the job listings
            });


        let jobListings = searchTerms.flatMap(term => term.jobListings);


        jobListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const user = await User.findById(userId).select('seenJobListings');

        // console.log("user", user);

        if (page === 'starred') {

            const starredIds = user.seenJobListings
                .filter(item => item.starred) // Only keep stared job listings
                .map(item => item.jobListing.toString());

            jobListings = jobListings.filter(job => starredIds.includes(job._id.toString()));

        } else {

            const seenJobIds = user.seenJobListings
                .filter(item => item.seen) // Only keep seen job listings
                .map(item => item.jobListing.toString());

            if (page === 'new') {
                // Return only unseen job listings
                jobListings = jobListings.filter(job => !seenJobIds.includes(job._id.toString()));
            } else if (page === 'seen') {
                // Return only seen job listings
                jobListings = jobListings.filter(job => seenJobIds.includes(job._id.toString()));
            }
        }
        return res.status(200).json(jobListings);

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
        // console.log(jobListing);
        res.status(200).json(jobListing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the job listing' });
    }
};

// Handler for creating a new job listing
exports.markJobId = async (req, res, next) => {
    const userId = req.payload._id;
    const jobId = req.params.jobId;
    const { markAs } = req.body;

    try {

        const updatedUser = await User.findOneAndUpdate(
            {
                _id: userId,
                "seenJobListings.jobListing": jobId // Check if the jobListing already exists
            },
            {
                $set: {
                    [`seenJobListings.$.${markAs}`]: true, // Set seen based on markAs value

                }
            },
            {
                new: true,
                upsert: false // Only update if it exists, don't create new if not found
            }
        );

        // If the jobListing doesn't exist, push it to the seenJobListings array
        if (!updatedUser) {
            await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        seenJobListings: {
                            jobListing: jobId,
                            [markAs]: true,
                        }
                    }
                },
                { new: true }
            );
        }

        res.status(200).json({ message: 'Job listing updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the job listing' });
    }
};

