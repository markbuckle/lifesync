import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_TASKS } from '../../graphql/queries';
import { CREATE_TASK_MUTATION, UPDATE_TASK_MUTATION, DELETE_TASK_MUTATION } from '../../graphql/mutations';
import TaskItem from '../../components/tasks/TaskItem';
import TaskFilter from '../../components/tasks/TaskFilter';
import TaskModal from '../../components/tasks/TaskModal';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  category: string;
  notes?: string;
}

interface GraphQLTask {
  id: number;
  title: string;
  completed: boolean;
  priority: string;
  dueDate: string;
  category: string;
  notes?: string;
}

interface TasksData {
  tasks: GraphQLTask[];
}

type FilterType = 'all' | 'active' | 'completed';

const TasksPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');

  // Fetch tasks
  const { loading, error, data, refetch } = useQuery<TasksData>(GET_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);  // Add this
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Create task mutation
  const [createTask] = useMutation(CREATE_TASK_MUTATION, {
    onCompleted: () => {
      refetch();
      setIsModalOpen(false);
      setEditingTask(null);
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      alert('Failed to create task: ' + error.message);
    },
  });

  // Update task mutation (for toggling completion)
  const [updateTask] = useMutation(UPDATE_TASK_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      alert('Failed to update task: ' + error.message);
    },
  });

  // Delete task mutation
  const [deleteTask] = useMutation(DELETE_TASK_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      alert('Failed to delete task: ' + error.message);
    },
  });

  const handleToggleComplete = (task: Task) => {
    updateTask({
      variables: {
        id: parseInt(task.id),
        taskInput: {
          title: task.title,
          completed: !task.completed,
          priority: task.priority,
          dueDate: task.dueDate.toISOString(),
          category: task.category,
          notes: task.notes || null,
        },
      },
    });
  };
const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      // Update existing task
      updateTask({
        variables: {
          id: parseInt(editingTask.id),
          taskInput: {
            title: taskData.title,
            completed: taskData.completed,
            priority: taskData.priority,
            dueDate: taskData.dueDate.toISOString(),
            category: taskData.category,
            notes: taskData.notes || null,
          },
        },
      });
    } else {
      // Create new task
      createTask({
        variables: {
          taskInput: {
            title: taskData.title,
            completed: taskData.completed,
            priority: taskData.priority,
            dueDate: taskData.dueDate.toISOString(),
            category: taskData.category,
            notes: taskData.notes || null,
          },
        },
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask({
        variables: {
          id: parseInt(id),
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-semibold">Error loading tasks</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  // Convert GraphQL data to component format
  const tasks: Task[] = data?.tasks.map(task => ({
    id: String(task.id),
    title: task.title,
    completed: task.completed,
    priority: task.priority as 'high' | 'medium' | 'low',
    dueDate: new Date(task.dueDate),
    category: task.category,
    notes: task.notes,
  })) || [];

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Sort tasks: incomplete first (by priority), then completed
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Sort incomplete by priority
    if (!a.completed && !b.completed) {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    return 0;
  });

  // Count tasks by filter
  const allCount = tasks.length;
  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          + New Task
        </button>
      </div>

      {/* Filter */}
      <TaskFilter
        currentFilter={filter}
        onFilterChange={setFilter}
        counts={{
          all: allCount,
          active: activeCount,
          completed: completedCount,
        }}
      />

      {/* Task List */}
      <div className="mt-6 space-y-3">
        {sortedTasks.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {filter === 'active' && 'No active tasks'}
            {filter === 'completed' && 'No completed tasks'}
            {filter === 'all' && 'No tasks yet'}
          </p>
        ) : (
          sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => handleToggleComplete(task)}
              onDelete={() => handleDeleteTask(task.id)}
              onEdit={() => handleEditTask(task)}
            />
          ))
        )}
      </div>
      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </div>
  );
};

export default TasksPage;