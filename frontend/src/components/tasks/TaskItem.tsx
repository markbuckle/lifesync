import React from 'react';
import { CheckSquare, Square, Circle, X } from 'lucide-react';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  category: string;
  notes?: string;
}

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
        task.completed
          ? 'bg-gray-50 border-gray-200'
          : 'bg-white border-gray-200 hover:border-primary hover:shadow-sm'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className="flex-shrink-0 mt-0.5 text-gray-400 hover:text-primary transition-colors"
      >
        {task.completed ? (
          <CheckSquare className="w-5 h-5 text-primary" />
        ) : (
          <Square className="w-5 h-5" />
        )}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className={`font-medium ${
              task.completed ? 'line-through text-gray-500' : 'text-gray-800'
            }`}
          >
            {task.title}
          </h3>
          
          {/* Priority Badge */}
          <span
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border whitespace-nowrap ${getPriorityColor(
              task.priority
            )}`}
          >
            <Circle className={`w-2 h-2 fill-current ${getPriorityDot(task.priority)}`} />
            {task.priority}
          </span>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            {format(task.dueDate, 'MMM d, yyyy')}
            {isOverdue && !task.completed && (
              <span className="text-red-500 font-medium ml-1">(Overdue)</span>
            )}
          </span>
          <span>•</span>
          <span>{task.category}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="flex-shrink-0 text-gray-400 hover:text-primary transition-colors p-1 rounded hover:bg-gray-100"
          title="Edit task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
          title="Delete task"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;