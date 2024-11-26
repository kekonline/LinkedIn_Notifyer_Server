// src/graphql/queries/items.ts
import { gql } from '@apollo/client';

export const CREATE_SEARCH_TERM = gql`
  mutation CreateSearchTerm($term: String!, $location: String!, $jobType: String!) {
    createSearchTerm( term: $term, location: $location, jobType: $jobType) {
    _id
    term
    location
    jobType
    users
    jobListings
    lastScraped
    URL
    }
  }
`;


export const DELETE_SEARCH_TERM = gql`
  mutation DeleteSearchTerm($id: ID!) {
    deleteSearchTerm(id: $id)
  }
`;



