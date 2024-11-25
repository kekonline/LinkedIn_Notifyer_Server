import { gql } from '@apollo/client';

export const GET_JOB_LISTINGS = gql`
  query GetJobListings($page: String!) {
    getJobListings( page: $page) {
      _id
      title
      company
      description
      jobURL
      createdAt
      updatedAt
    }
  }
`;
