import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const createApolloClient = () => {
    return new ApolloClient({
        ssrMode: typeof window === 'undefined', // Disables force-fetching on the server (so queries are only run once)
        link: new HttpLink({
            uri: '/api/graphql', // The URL of the API route created earlier
            credentials: 'same-origin',
        }),
        cache: new InMemoryCache(),
    });
};

export default createApolloClient;
