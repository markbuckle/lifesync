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

export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($taskInput: TaskInput!) {
    createTask(taskInput: $taskInput) {
      id
      title
      completed
      priority
      dueDate
      category
      notes
    }
  }
`;

export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($id: Int!, $taskInput: TaskInput!) {
    updateTask(id: $id, taskInput: $taskInput) {
      id
      title
      completed
      priority
      dueDate
      category
      notes
    }
  }
`;

export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($id: Int!) {
    deleteTask(id: $id) {
      id
    }
  }
`;