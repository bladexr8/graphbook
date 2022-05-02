// initialise Apollo Client
// refer to Appollo docs - https://www.apollographql.com/docs/react/essentials/get-started.html

import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';
import { onError } from "@apollo/client/link/error";

import { gql } from '@apollo/client';

const client = new ApolloClient({
  link: from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) => 
        console.log('[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}'));
        if (networkError) {
          console.log('[Network error]: ${networkError}');
        }
      }
    }),
    new HttpLink({
      uri: 'http://localhost:8000/graphql',
    }),
 ]),
 cache: new InMemoryCache(),
});

// Test Apollo Client is working
//client.query({query: gql`{ posts { id text user { avatar username }}}`}).then(result => console.log(result));

export default client;