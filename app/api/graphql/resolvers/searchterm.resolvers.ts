import SearchTerm from './../../../models/SearchTerm.model';
import User from './../../../models/User.model';
import { GraphQLError } from 'graphql';

const resolvers = {
    Query: {
        // Get all search terms associated with the authenticated user
        searchTerms: async (_: any, __: any, context: { req: Request, userId: string }) => {

            const { userId } = context;

            if (!userId) {
                throw new GraphQLError('User not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            return await SearchTerm.find({ users: userId }).select('-users').sort({ term: 1 });
        },

        // Get a single search term by its ID
        searchTerm: async (_: any, { id }: { id: string }, context: { req: Request, userId: string }) => {

            const { userId } = context;

            if (!userId) {
                throw new GraphQLError('User not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            return await SearchTerm.findById(id).select('-users');
        }
    },

    Mutation: {
        // Create or update a search term
        createSearchTerm: async (
            _: any,
            { term, location, jobType }: { term: string; location: string; jobType: string },
            context: { req: Request, userId: string }
        ) => {

            const { userId } = context;

            if (!userId) {
                throw new GraphQLError('User not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
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
        deleteSearchTerm: async (_: any, { id }: { id: string }, context: { req: Request, userId: string }) => {

            const { userId } = context;

            if (!userId) {
                throw new GraphQLError('User not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
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
