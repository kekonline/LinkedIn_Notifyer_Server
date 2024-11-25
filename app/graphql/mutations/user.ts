// src/graphql/queries/items.ts
import { gql } from '@apollo/client';

export const GET_TOKEN = gql`
  mutation GetToken {
    getToken {
      message
      error
      authToken
    }
  }
`;