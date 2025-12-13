import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Project Details (ID: {id})</h1>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <p className="text-gray-600">Project detail view coming soon...</p>
      </div>
    </div>
  );
};

export default ProjectDetailPage;