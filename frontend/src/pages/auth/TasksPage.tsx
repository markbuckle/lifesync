import React, { useState } from 'react';
import TaskItem from '../../components/tasks/TaskItem';
import TaskFilter from '../../components/tasks/TaskFilter';
import { sampleTasks, Task } from '../../sampleData';


const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          + New Task
        </button>
      </div>

      <TaskFilter currentFilter={filter} onFilterChange={setFilter} counts={counts} />
      
      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />
          ))
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-gray-600">
              {filter === 'completed'
                ? 'No completed tasks yet.'
                : filter === 'active'
                ? 'No active tasks. Great job!'
                : 'No tasks yet. Create your first one!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;