import React from 'react';

interface TaskFilterProps {
  currentFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

const TaskFilter: React.FC<TaskFilterProps> = ({ currentFilter, onFilterChange, counts }) => {
  const filters = [
    { id: 'all' as const, label: 'All Tasks', count: counts.all },
    { id: 'active' as const, label: 'Active', count: counts.active },
    { id: 'completed' as const, label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentFilter === filter.id
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary'
          }`}
        >
          {filter.label} ({filter.count})
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;