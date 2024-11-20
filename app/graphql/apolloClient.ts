import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Initialize Apollo Client
const createApolloClient = () => {
    const link = new HttpLink({
        uri: '/api/graphql',
        credentials: 'same-origin',
    });

    return new ApolloClient({
        link,
        cache: new InMemoryCache(),
        ssrMode: typeof window === 'undefined',
    });
};


const client = createApolloClient();

export default client;
