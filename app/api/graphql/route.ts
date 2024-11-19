import { NextRequest } from 'next/server';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';
import { mergeTypeDefs } from '@graphql-tools/merge';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import path from 'path';

const getUserIdFromToken = (authorizationHeader: string | null): string | null => {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    console.warn("Authorization header missing or improperly formatted.");
    return null;
  }

  const token = authorizationHeader.slice(7).trim();
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as { _id: string };
    return decoded._id;
  } catch (err) {
    console.error("JWT verification error:", err);
    return null;
  }
};

const context = async (req: NextRequest) => {
  const userId = getUserIdFromToken(req.headers.get('authorization'));
  return { req, userId };
};

const userTypeDefs = gql(readFileSync(path.join(process.cwd(), 'app/api/graphql/schema/user.schema.graphql'), 'utf8'));
const jobListingTypeDefs = gql(readFileSync(path.join(process.cwd(), 'app/api/graphql/schema/job.schema.graphql'), 'utf8'));
const searchTermTypeDefs = gql(readFileSync(path.join(process.cwd(), 'app/api/graphql/schema/searchTerm.schema.graphql'), 'utf8'));

const typeDefs = mergeTypeDefs([userTypeDefs, jobListingTypeDefs, searchTermTypeDefs]);

import userResolvers from './resolvers/user.resolvers';
import jobListingResolvers from './resolvers/job.resolvers';
import searchTermResolvers from './resolvers/searchterm.resolvers';

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...jobListingResolvers.Query,
    ...searchTermResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...jobListingResolvers.Mutation,
    ...searchTermResolvers.Mutation,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, { context });

export { handler as GET, handler as POST };
