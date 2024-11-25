// src/graphql/queries/items.ts
import { gql } from '@apollo/client';

export const UPDATE_JOB_LISTING = gql`
  mutation UpdateJobListingStatus($jobId: String!, $markAs: String!) {
    updateJobListingStatus(jobId: $jobId, markAs: $markAs) {
      message
      error
      authToken
    }
  }
`;


// updateJobListingStatus(jobId: ID!, markAs: JobListingMarkAs!): String! # Update the status of a job listing

// export const GET_JOB_LISTINGS = gql`
//   query GetJobListings($page: String!) {
//     getJobListings( page: $page) {
//       _id
//       title
//       company
//       description
//       jobURL
//       createdAt
//       updatedAt
//     }
//   }
// `;
