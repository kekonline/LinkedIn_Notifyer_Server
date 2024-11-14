import { AuthenticationError } from 'apollo-server-express';
import SearchTerm from './../../../models/SearchTerm.model';
import User from './../../../models/User.model';
import { authentication } from './middleware';

const resolvers = {
    Query: {
        // Get all search terms associated with the authenticated user
        searchTerms: async (_: any, __: any, { userId }: { userId: string }) => {
            if (!userId) {
                throw new AuthenticationError('User not authenticated');
            }
            return await SearchTerm.find({ users: userId }).select('-users').sort({ term: 1 });
        },

        // Get a single search term by its ID
        searchTerm: async (_: any, { id }: { id: string }, { userId }: { userId: string }) => {
            if (!userId) {
                throw new AuthenticationError('User not authenticated');
            }
            return await SearchTerm.findById(id).select('-users');
        }
    },

    Mutation: {
        // Create or update a search term
        createSearchTerm: async (
            _: any,
            { term, location, jobType }: { term: string; location: string; jobType: string },
            { userId }: { userId: string }
        ) => {
            if (!userId) {
                throw new AuthenticationError('User not authenticated');
            }

            if (!term || !location) {
                throw new Error('Term and location are required');
            }

            const updatedSearchTerm = await SearchTerm.findOneAndUpdate(
                {
                    term: term.trim().toLowerCase(),
                    location: location.trim().toLowerCase(),
                    jobType: jobType ? jobType.trim().toLowerCase() : jobType,
                },
                { $addToSet: { users: userId } },
                { new: true, upsert: true }
            );

            const searchTermId = updatedSearchTerm ? updatedSearchTerm._id : null;

            if (searchTermId) {
                await User.findByIdAndUpdate(userId, {
                    $addToSet: { searchTerms: searchTermId },
                });
            }

            return updatedSearchTerm;
        },

        // Delete a search term
        deleteSearchTerm: async (_: any, { id }: { id: string }, { userId }: { userId: string }) => {
            if (!userId) {
                throw new AuthenticationError('User not authenticated');
            }

            const searchTerm = await SearchTerm.findById(id);
            if (!searchTerm) {
                throw new Error('Search term not found');
            }

            await SearchTerm.findOneAndUpdate(
                { _id: id },
                { $pull: { users: userId } }
            );

            await User.findOneAndUpdate(
                { _id: userId },
                { $pull: { searchTerms: id } }
            );

            return 'Search term deleted successfully';
        }
    }
};

export default resolvers;
