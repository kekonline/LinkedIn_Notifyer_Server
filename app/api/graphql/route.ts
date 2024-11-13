import { NextRequest } from 'next/server';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { resolvers } from './resolvers';
// import { mergeTypeDefs } from '@graphql-tools/merge';
import { gql } from 'graphql-tag';
import { readFileSync } from 'fs';
import path from 'path';


// const typeDefs = mergeTypeDefs([UserTypeDefs, JobListingTypeDefs, SearchTermTypeDefs]);
const typeDefs = gql(readFileSync(path.join(process.cwd(), 'app/api/graphql/schema/user.graphql'), 'utf8'));

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async req => ({ req }),
});

export { handler as GET, handler as POST };


// import userResolvers from './userResolvers';
// import jobListingResolvers from './jobListingResolvers';
// import searchTermResolvers from './searchTermResolvers';

// export const resolvers = {
//   Query: {
//     ...userResolvers.Query,
//     ...jobListingResolvers.Query,
//     ...searchTermResolvers.Query,
//   },
//   Mutation: {
//     ...userResolvers.Mutation,
//     ...jobListingResolvers.Mutation,
//     ...searchTermResolvers.Mutation,
//   },
// };