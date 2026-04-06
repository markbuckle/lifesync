import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($credentials: UserLoginInput!) {
    login(credentials: $credentials) {
      accessToken
      tokenType
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($userInput: UserCreateInput!) {
    register(userInput: $userInput) {
      id
      email
      firstName
      lastName
      isActive
    }
  }
`;