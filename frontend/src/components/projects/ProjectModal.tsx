import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

interface Project {
  id: string;
  name: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  dueDate: Date;
  tasksCompleted: number;
  tasksTotal: number;
  description?: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>) => void;
  editingProject?: Project | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProject,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    status: 'on-track',
    dueDate: new Date().toISOString().split('T')[0],
    tasksCompleted: 0,
    tasksTotal: 0,
    description: '',
  });

  // Calculate progress automatically
  const calculatedProgress = formData.tasksTotal > 0 
    ? Math.round((formData.tasksCompleted / formData.tasksTotal) * 100)
    : 0;

  // Update form when editingProject changes
  useEffect(() => {
    if (editingProject) {
      setFormData({
        name: editingProject.name,
        status: editingProject.status,
        dueDate: editingProject.dueDate.toISOString().split('T')[0],
        tasksCompleted: editingProject.tasksCompleted,
        tasksTotal: editingProject.tasksTotal,
        description: editingProject.description || '',
      });
    } else {
      // Reset form for new project
      setFormData({
        name: '',
        status: 'on-track',
        dueDate: new Date().toISOString().split('T')[0],
        tasksCompleted: 0,
        tasksTotal: 0,
        description: '',
      });
    }
  }, [editingProject, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate tasks
    if (formData.tasksCompleted > formData.tasksTotal) {
      alert('Completed tasks cannot exceed total tasks');
      return;
    }
    
    const newProject: Omit<Project, 'id'> = {
      name: formData.name,
      progress: calculatedProgress,
      status: formData.status as 'on-track' | 'at-risk' | 'delayed',
      dueDate: new Date(formData.dueDate),
      tasksCompleted: formData.tasksCompleted,
      tasksTotal: formData.tasksTotal,
      description: formData.description || undefined,
    };

    onSave(newProject);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      status: 'on-track',
      dueDate: new Date().toISOString().split('T')[0],
      tasksCompleted: 0,
      tasksTotal: 0,
      description: '',
    });
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingProject ? 'Edit Project' : 'New Project'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Website Redesign"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="on-track">On Track</option>
            <option value="at-risk">At Risk</option>
            <option value="delayed">Delayed</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Tasks */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tasks Completed
            </label>
            <input
              type="number"
              name="tasksCompleted"
              min="0"
              max={formData.tasksTotal || undefined}
              value={formData.tasksCompleted}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Tasks
            </label>
            <input
              type="number"
              name="tasksTotal"
              min="0"
              value={formData.tasksTotal}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Auto-calculated Progress Display */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span className="font-medium">Progress (auto-calculated)</span>
            <span className="font-semibold text-primary">{calculatedProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${calculatedProgress}%` }}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Project description..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {editingProject ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;