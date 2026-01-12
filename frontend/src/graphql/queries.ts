import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      firstName
      lastName
      isActive
      createdAt
    }
  }
`;

export const GET_APPOINTMENTS = gql`
  query GetAppointments {
    appointments {
      id
      title
      date
      time
      type
      color
      notes
      createdAt
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      completed
      priority
      dueDate
      category
      notes
      createdAt
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      progress
      status
      dueDate
      tasksCompleted
      tasksTotal
      description
      createdAt
    }
  }
`;

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    me {
      id
      firstName
      lastName
    }
    appointments {
      id
      title
      date
      time
      type
      color
    }
    tasks {
      id
      title
      completed
      priority
      dueDate
      category
    }
    projects {
      id
      name
      progress
      status
      dueDate
      tasksCompleted
      tasksTotal
    }
  }
`;