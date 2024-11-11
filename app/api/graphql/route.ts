import { NextRequest } from 'next/server';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { resolvers } from './resolvers';
import { gql } from 'graphql-tag';
import { readFileSync } from 'fs';
import path from 'path';

const typeDefs = gql(readFileSync(path.join(process.cwd(), 'app/api/graphql/schema.graphql'), 'utf8'));

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async req => ({ req }),
});

export { handler as GET, handler as POST };