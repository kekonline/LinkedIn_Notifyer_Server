import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

// Define your GraphQL schema
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    hello: () => "Hello, World!",
  },
};

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Export the handler for the GET method (GraphQL Playground)
export const GET = startServerAndCreateNextHandler(server);

// Optional: export POST if necessary
export const POST = startServerAndCreateNextHandler(server);

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for GraphQL requests
  },
};

// import { ApolloServer } from "@apollo/server";
// import { startServerAndCreateNextHandler } from "@as-integrations/next";
// import { gql } from "graphql-tag";
// import { NextResponse } from "next/server";

// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `;

// const resolvers = {
//   Query: {
//     hello: () => "Hello, GraphQL!",
//   },
// };

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// export async function GET(request: Request) {
//   const handler = startServerAndCreateNextHandler(server);
//   return handler(request);
// }