import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: '/api/graphql/route',
    cache: new InMemoryCache(),
});

export default client;
