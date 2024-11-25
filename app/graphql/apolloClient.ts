import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
    uri: '/api/graphql',
    credentials: 'same-origin',
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('authToken');

    // console.log('apollo client token', token);

    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const link = authLink.concat(httpLink);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    ssrMode: typeof window === 'undefined',
});

export default client;
