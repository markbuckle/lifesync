import React, { useState } from 'react';
import ProjectCard from '../../components/projects/ProjectCard';
import { sampleProjects } from '../../sampleData';

const ProjectsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredProjects = sampleProjects.filter((project) => {
      if (filter === 'active') return project.progress < 100;
      if (filter === 'completed') return project.progress === 100;
      return true;
    });

  // Sort by status priority (at-risk/delayed first, then on-track)
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const statusOrder = { delayed: 0, 'at-risk': 1, 'on-track': 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const counts = {
    all: sampleProjects.length,
    active: sampleProjects.filter((p) => p.progress < 100).length,
    completed: sampleProjects.filter((p) => p.progress === 100).length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          + New Project
        </button>
      </div>
      
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary'
          }`}
        >
          All Projects ({counts.all})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'active'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary'
          }`}
        >
          Active ({counts.active})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'completed'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary'
          }`}
        >
          Completed ({counts.completed})
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProjects.length > 0 ? (
          sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="col-span-full bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-gray-600">
              {filter === 'completed'
                ? 'No completed projects yet.'
                : filter === 'active'
                ? 'No active projects.'
                : 'No projects yet. Create your first one!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;