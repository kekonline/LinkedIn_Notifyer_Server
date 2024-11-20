// src/graphql/queries/items.ts
import { gql } from '@apollo/client';

export const VERIFY_TOKEN = gql`
  query VerifyToken {
    verifyToken {
      message
      error
      enrolled
      email
      getNotifications
      isActive
    }
  }
`;
