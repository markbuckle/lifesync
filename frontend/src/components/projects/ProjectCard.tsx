import React from 'react';
import { Folder, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { Project } from '../../sampleData';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'delayed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <TrendingUp className="w-4 h-4" />;
      case 'at-risk':
      case 'delayed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getProgressColor = (progress: number, status: string) => {
    if (status === 'at-risk') return 'bg-yellow-500';
    if (status === 'delayed') return 'bg-red-500';
    return 'bg-primary';
  };

  return (
    <Link to={`/projects/${project.id}`}>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-primary hover:shadow-md transition-all cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-light rounded-lg">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {project.name}
              </h3>
              <p className="text-sm text-gray-500">
                {project.tasksCompleted} of {project.tasksTotal} tasks completed
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              project.status
            )}`}
          >
            {getStatusIcon(project.status)}
            {project.status.replace('-', ' ')}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span className="font-semibold">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${getProgressColor(
                project.progress,
                project.status
              )}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Due {format(project.dueDate, 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;