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

export const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $password: String!) {
    registerUser(email: $email, password: $password) {
      message
      error
    }
  }
`;