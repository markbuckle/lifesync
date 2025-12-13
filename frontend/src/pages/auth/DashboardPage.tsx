import React from 'react';

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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-primary">Today</h2>
          <div className="space-y-2">
            <p className="text-gray-600">3 appointments</p>
            <p className="text-gray-600">5 tasks due</p>
          </div>
        </div>

        {/* This Week Widget */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-primary">This Week</h2>
          <div className="space-y-2">
            <p className="text-gray-600">12 appointments</p>
            <p className="text-gray-600">18 tasks</p>
          </div>
        </div>

        {/* Projects Widget */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-primary">Projects</h2>
          <div className="space-y-2">
            <p className="text-gray-600">3 active projects</p>
            <p className="text-gray-600">2 need attention</p>
          </div>
        </div>

        {/* AI Insights Widget */}
        <div className="bg-primary text-white p-6 rounded-xl shadow-sm col-span-full">
          <div className="flex items-start">
            <span className="text-3xl mr-4">✨</span>
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