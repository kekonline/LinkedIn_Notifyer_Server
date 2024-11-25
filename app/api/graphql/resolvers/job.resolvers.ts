import { GraphQLError } from 'graphql';
import UserModel, { User } from './../../../models/User.model'; // Import User model
import JobListing from './../../../models/JobListing.model';
import SearchTerm from './../../../models/SearchTerm.model';

const resolvers = {
    Query: {
        // Query to get all job listings for a specific page
        async getJobListings(
            _: unknown,
            { page }: { page: string },
            context: { req: Request; userId: string }
        ): Promise<JobListing[]> {
            const { userId } = context;

            if (!userId) {
                throw new GraphQLError('User not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            console.log("page", page)

            // Get search terms and associated job listings for the user
            const searchTerms = await SearchTerm.find({ users: userId }).populate({
                path: 'jobListings',
                select: '-users',
            });

            let jobListings = searchTerms.flatMap((term) => term.jobListings);

            // Sort job listings by creation date (most recent first)
            jobListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            // Retrieve user's seen job listings
            const user = await UserModel.findById(userId)
                .select('seenJobListings')
                .lean<User | null>();

            if (!user) {
                throw new Error('User not found');
            }

            if (page === 'starred') {
                const starredIds = user.seenJobListings
                    .filter((item) => item.starred)
                    .map((item) => item.jobListing.toString());
                jobListings = jobListings.filter((job) => starredIds.includes(job._id.toString()));
            } else {
                const seenJobIds = user.seenJobListings
                    .filter((item) => item.seen)
                    .map((item) => item.jobListing.toString());
                if (page === 'new') {
                    jobListings = jobListings.filter((job) => !seenJobIds.includes(job._id.toString()));
                } else if (page === 'seen') {
                    jobListings = jobListings.filter((job) => seenJobIds.includes(job._id.toString()));
                }
            }

            return jobListings;
        },

        // Query to get a job listing by ID
        async getJobListingById(_: unknown, { jobId }: { jobId: string }) {
            const jobListing = await JobListing.findById(jobId).select('-users');
            if (!jobListing) {
                throw new Error('Job listing not found');
            }
            return jobListing;
        },
    },

    Mutation: {
        // Mutation to update the job listing status (starred or seen)
        async updateJobListingStatus(
            _: unknown,
            { jobId, markAs }: { jobId: string; markAs: 'seen' | 'starred' },
            context: { req: Request; userId: string }
        ) {
            const { userId } = context;

            if (!userId) {
                throw new GraphQLError('User not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            // Update the job listing status in the user's seenJobListings array
            const updatedUser = await UserModel.findOneAndUpdate(
                {
                    _id: userId,
                    'seenJobListings.jobListing': jobId, // Check if the jobListing already exists
                },
                {
                    $set: {
                        [`seenJobListings.$.${markAs}`]: true, // Update the specific field
                    },
                },
                {
                    new: true,
                }
            );

            if (!updatedUser) {
                // If no existing entry, add a new one
                await UserModel.findByIdAndUpdate(
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
