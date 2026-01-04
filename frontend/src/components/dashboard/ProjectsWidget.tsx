import React from 'react';
import { Folder, TrendingUp, AlertCircle } from 'lucide-react';
import { Project } from '../../sampleData';

interface ProjectsWidgetProps {
  projects: Project[];
}

const ProjectsWidget: React.FC<ProjectsWidgetProps> = ({ projects }) => {
  const activeProjects = projects.filter((p) => p.progress < 100);
  const atRiskCount = projects.filter((p) => p.status === 'at-risk').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-700';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-700';
      case 'delayed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <TrendingUp className="w-3 h-3" />;
      case 'at-risk':
      case 'delayed':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-primary flex items-center">
        <Folder className="w-5 h-5 mr-2" />
        Projects
      </h2>

      <div className="space-y-4">
        {/* Project List */}
        {activeProjects.length > 0 ? (
          <div className="space-y-3">
            {activeProjects.map((project) => (
              <div key={project.id} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-800">
                    {project.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatusIcon(project.status)}
                    {project.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>
                    {project.tasksCompleted}/{project.tasksTotal} tasks
                  </span>
                  <span>{project.progress}%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No active projects</p>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {activeProjects.length} active • {atRiskCount} need{atRiskCount !== 1 ? '' : 's'} attention
        </p>
      </div>
    </div>
  );
};

export default ProjectsWidget;