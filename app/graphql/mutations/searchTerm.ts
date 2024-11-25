// src/graphql/queries/items.ts
import { gql } from '@apollo/client';

export const CREATE_SEARCH_TERM = gql`
  mutation CreateSearchTerm($jobId: String!, $markAs: String!) {
    createSearchTerm(jobId: $jobId, markAs: $markAs) {
    id
    }
  }
`;


export const DELETE_SEARCH_TERM = gql`
  mutation DeleteSearchTerm($id: String!) {
    deleteSearchTerm( id: $id) {
    message
    }
  }
`;

