import React from 'react';

const ProjectsPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
          + New Project
        </button>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <p className="text-gray-600">No projects yet. Create your first one!</p>
      </div>
    </div>
  );
};

export default ProjectsPage;