import { gql } from '@apollo/client';

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
    # projects {
    #   id
    #   name
    #   progress
    #   status
    #   dueDate
    #   tasksCompleted
    #   tasksTotal
    # }
  }
`;