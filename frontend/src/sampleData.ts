// Sample data for dashboard widgets
export interface Appointment {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'meeting' | 'doctor' | 'personal' | 'work';
  color: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  dueDate: Date;
  tasksCompleted: number;
  tasksTotal: number;
}

// Today's date for reference
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

// Sample appointments
export const sampleAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Team Standup',
    date: today,
    time: '10:00 AM',
    type: 'meeting',
    color: '#3B82F6',
  },
  {
    id: '2',
    title: 'Client Call',
    date: today,
    time: '2:00 PM',
    type: 'work',
    color: '#B85C38',
  },
  {
    id: '3',
    title: 'Dentist Appointment',
    date: tomorrow,
    time: '9:00 AM',
    type: 'doctor',
    color: '#10B981',
  },
  {
    id: '4',
    title: 'Project Review',
    date: tomorrow,
    time: '3:00 PM',
    type: 'meeting',
    color: '#3B82F6',
  },
  {
    id: '5',
    title: 'Gym Session',
    date: nextWeek,
    time: '6:00 PM',
    type: 'personal',
    color: '#8B5CF6',
  },
];

// Sample tasks
export const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Review Q4 budget proposal',
    completed: false,
    priority: 'high',
    dueDate: today,
    category: 'Work',
  },
  {
    id: '2',
    title: 'Prepare presentation slides',
    completed: false,
    priority: 'high',
    dueDate: today,
    category: 'Work',
  },
  {
    id: '3',
    title: 'Call insurance company',
    completed: false,
    priority: 'medium',
    dueDate: tomorrow,
    category: 'Personal',
  },
  {
    id: '4',
    title: 'Update project documentation',
    completed: true,
    priority: 'medium',
    dueDate: today,
    category: 'Work',
  },
  {
    id: '5',
    title: 'Schedule team meeting',
    completed: false,
    priority: 'low',
    dueDate: nextWeek,
    category: 'Work',
  },
];

// Sample projects
export const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    progress: 65,
    status: 'on-track',
    dueDate: nextWeek,
    tasksCompleted: 13,
    tasksTotal: 20,
  },
  {
    id: '2',
    name: 'Mobile App Launch',
    progress: 40,
    status: 'at-risk',
    dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
    tasksCompleted: 8,
    tasksTotal: 20,
  },
  {
    id: '3',
    name: 'Q4 Marketing Campaign',
    progress: 85,
    status: 'on-track',
    dueDate: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
    tasksCompleted: 17,
    tasksTotal: 20,
  },
];