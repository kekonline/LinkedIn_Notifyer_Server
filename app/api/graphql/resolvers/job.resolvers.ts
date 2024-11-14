// import { AuthenticationError } from 'apollo-server-express';

import User, { User as UserDocument } from './../../../models/User.model'; // Import User interface
import JobListing from './../../../models/JobListing.model';
import SearchTerm from './../../../models/SearchTerm.model';


const resolvers = {
    Query: {
        // Query to get all job listings for a specific page
        async getJobListings(_, { page }, { userId }) {
            if (!userId) {
                throw new AuthenticationError('User not authenticated');
            }

            const searchTerms = await SearchTerm.find({ users: userId }).populate({
                path: 'jobListings',
                select: '-users',
            });

            let jobListings = searchTerms.flatMap((term) => term.jobListings);

            jobListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            const user = await User.findById(userId).select('seenJobListings').lean();

            if (!user) {
                throw new Error('User not found');
            }

            if (page === 'starred') {
                const starredIds = user.seenJobListings.filter(item => item.starred).map(item => item.jobListing.toString());
                jobListings = jobListings.filter(job => starredIds.includes(job._id.toString()));
            } else {
                const seenJobIds = user.seenJobListings.filter(item => item.seen).map(item => item.jobListing.toString());
                if (page === 'new') {
                    jobListings = jobListings.filter(job => !seenJobIds.includes(job._id.toString()));
                } else if (page === 'seen') {
                    jobListings = jobListings.filter(job => seenJobIds.includes(job._id.toString()));
                }
            }

            return jobListings;
        },

        // Query to get a job listing by ID
        async getJobListingById(_, { jobId }) {
            const jobListing = await JobListing.findById(jobId).select('-users');
            if (!jobListing) {
                throw new Error('Job listing not found');
            }
            return jobListing;
        },
    },

    Mutation: {
        // Mutation to update the job listing status (starred or seen)
        async updateJobListingStatus(_, { jobId, markAs }, { userId }) {
            if (!userId) {
                throw new AuthenticationError('User not authenticated');
            }

            const updatedUser = await User.findOneAndUpdate(
                {
                    _id: userId,
                    'seenJobListings.jobListing': jobId, // Check if the jobListing already exists
                },
                {
                    $set: {
                        [`seenJobListings.$.${markAs}`]: true, // Set seen based on markAs value
                    },
                },
                {
                    new: true,
                    upsert: false, // Only update if it exists, don't create new if not found
                }
            );

            if (!updatedUser) {
                await User.findByIdAndUpdate(
                    userId,
                    {
                        $push: {
                            seenJobListings: {
                                jobListing: jobId,
                                [markAs]: true,
                            },
                        },
                    },
                    { new: true }
                );
            }

            return 'Job listing updated successfully';
        },
    },
};

export default resolvers;
