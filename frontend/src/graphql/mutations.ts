import { gql } from '@apollo/client';

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

export const CREATE_APPOINTMENT_MUTATION = gql`
  mutation CreateAppointment($appointmentInput: AppointmentInput!) {
    createAppointment(appointmentInput: $appointmentInput) {
      id
      title
      date
      time
      type
      color
      notes
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

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($projectInput: ProjectInput!) {
    createProject(projectInput: $projectInput) {
      id
      name
      progress
      status
      dueDate
      tasksCompleted
      tasksTotal
      description
    }
  }
`;