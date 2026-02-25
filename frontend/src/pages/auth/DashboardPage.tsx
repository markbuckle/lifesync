import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_DASHBOARD_DATA } from '../../graphql/queries';
import TodayWidget from '../../components/dashboard/TodayWidget';
import ThisWeekWidget from '../../components/dashboard/ThisWeekWidget';
import ProjectsWidget from '../../components/dashboard/ProjectsWidget';
// import { sampleAppointments, sampleTasks, sampleProjects } from '../../sampleData';
import { Sparkles } from 'lucide-react';

interface DashboardData {
  me: {
    id: number;
    firstName: string;
    lastName: string;
  };
  appointments: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    type: string;
    color: string;
  }>;
  tasks: Array<{
    id: number;
    title: string;
    completed: boolean;
    priority: string;
    dueDate: string;
    category: string;
  }>;
  projects: Array<{
    id: number;
    name: string;
    progress: number;
    status: string;
    dueDate: string;
    tasksCompleted: number;
    tasksTotal: number;
  }>;
}

const DashboardPage: React.FC = () => {
  const { loading, error, data } = useQuery<DashboardData>(GET_DASHBOARD_DATA);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading dashboard</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  // Convert API data to format expected by widgets
  const appointments = data.appointments.map(apt => ({
    id: String(apt.id),
    title: apt.title,
    date: new Date(apt.date),
    time: apt.time,
    type: apt.type as 'meeting' | 'doctor' | 'personal' | 'work',
    color: apt.color,
  }));

  const tasks = data.tasks.map(task => ({
    id: String(task.id),
    title: task.title,
    completed: task.completed,
    priority: task.priority as 'high' | 'medium' | 'low',
    dueDate: new Date(task.dueDate),
    category: task.category,
  }));

  const projects = data.projects.map(proj => ({
    id: String(proj.id),
    name: proj.name,
    progress: proj.progress,
    status: proj.status as 'on-track' | 'at-risk' | 'delayed',
    dueDate: new Date(proj.dueDate),
    tasksCompleted: proj.tasksCompleted,
    tasksTotal: proj.tasksTotal,
  }));

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        {greeting()}, {data.me.firstName}
      </h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today Widget */}
        <TodayWidget appointments={appointments} tasks={tasks} />

        {/* This Week Widget */}
        <ThisWeekWidget appointments={appointments} tasks={tasks} />

        {/* Projects Widget */}
        <ProjectsWidget projects={projects} />

        {/* AI Insights Widget */}
        <div className="bg-primary text-white p-6 rounded-xl shadow-sm col-span-full">
          <div className="flex items-start">
           <Sparkles className="w-8 h-8 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-2">AI Insight</h2>
              <p className="opacity-90">
                 {appointments.length === 0 && tasks.length === 0
                  ? "You're all caught up! Great time to plan your week or start a new project."
                  : projects.find(p => p.status === 'at-risk')
                  ? `${projects.find(p => p.status === 'at-risk')?.name} needs attention. Consider reviewing the timeline.`
                  : "You have a light day tomorrow. Great time to work on your projects!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;