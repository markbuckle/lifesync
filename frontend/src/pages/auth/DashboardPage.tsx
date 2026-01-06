import React from 'react';
import { Sparkles } from 'lucide-react';
import TodayWidget from '../../components/dashboard/TodayWidget';
import ThisWeekWidget from '../../components/dashboard/ThisWeekWidget';
import ProjectsWidget from '../../components/dashboard/ProjectsWidget';
import { sampleAppointments, sampleTasks, sampleProjects } from '../../sampleData';


const DashboardPage: React.FC = () => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">{greeting()}</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today Widget */}
        <TodayWidget appointments={sampleAppointments} tasks={sampleTasks} />

        {/* This Week Widget */}
        <ThisWeekWidget appointments={sampleAppointments} tasks={sampleTasks} />

        {/* Projects Widget */}
        <ProjectsWidget projects={sampleProjects} />

        {/* AI Insights Widget */}
        <div className="bg-primary text-white p-6 rounded-xl shadow-sm col-span-full">
          <div className="flex items-start">
           <Sparkles className="w-8 h-8 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-2">AI Insight</h2>
              <p className="opacity-90">
                You have a light day tomorrow. Great time to work on Project Alpha!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;