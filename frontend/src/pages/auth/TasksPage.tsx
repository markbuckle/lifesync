import React from 'react';

const TasksPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
          + New Task
        </button>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <p className="text-gray-600">No tasks yet. Add your first task!</p>
      </div>
    </div>
  );
};

export default TasksPage;