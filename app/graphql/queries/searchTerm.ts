import { gql } from '@apollo/client';

export const GET_SEARCH_TERMS = gql`
  query SearchTerms{
    searchTerms {
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
