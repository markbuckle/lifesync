import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import { GET_PROJECTS } from '../../graphql/queries';
import { CREATE_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION, DELETE_PROJECT_MUTATION } from '../../graphql/mutations';
import ProjectModal from '../../components/projects/ProjectModal';
import { ChevronRight, Plus, Edit } from 'lucide-react';

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

interface GraphQLProject {
  id: number;
  name: string;
  progress: number;
  status: string;
  dueDate: string;
  tasksCompleted: number;
  tasksTotal: number;
  description?: string;
}

interface ProjectsData {
  projects: GraphQLProject[];
}

const ProjectsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Fetch projects
  const { loading, error, data, refetch } = useQuery<ProjectsData>(GET_PROJECTS);

  // Create project mutation
  const [createProject] = useMutation(CREATE_PROJECT_MUTATION, {
    onCompleted: () => {
      refetch();
      setIsModalOpen(false);
      setEditingProject(null);
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      alert('Failed to create project: ' + error.message);
    },
  });

  // Update project mutation
  const [updateProject] = useMutation(UPDATE_PROJECT_MUTATION, {
    onCompleted: () => {
      refetch();
      setIsModalOpen(false);
      setEditingProject(null);
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      alert('Failed to update project: ' + error.message);
    },
  });

  // Delete project mutation
  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
      alert('Failed to delete project: ' + error.message);
    },
  });

  const handleSaveProject = (projectData: Omit<Project, 'id'>) => {
    if (editingProject) {
      // Update existing project
      updateProject({
        variables: {
          id: parseInt(editingProject.id),
          projectInput: {
            name: projectData.name,
            progress: projectData.progress,
            status: projectData.status,
            dueDate: projectData.dueDate.toISOString(),
            tasksCompleted: projectData.tasksCompleted,
            tasksTotal: projectData.tasksTotal,
            description: projectData.description || null,
          },
        },
      });
    } else {
      // Create new project
      createProject({
        variables: {
          projectInput: {
            name: projectData.name,
            progress: projectData.progress,
            status: projectData.status,
            dueDate: projectData.dueDate.toISOString(),
            tasksCompleted: projectData.tasksCompleted,
            tasksTotal: projectData.tasksTotal,
            description: projectData.description || null,
          },
        },
      });
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProject({
        variables: {
          id: parseInt(id),
        },
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'On Track';
      case 'at-risk':
        return 'At Risk';
      case 'delayed':
        return 'Delayed';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-semibold">Error loading projects</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  // Convert GraphQL data to component format
  const projects: Project[] = data?.projects.map(proj => ({
    id: String(proj.id),
    name: proj.name,
    progress: proj.progress,
    status: proj.status as 'on-track' | 'at-risk' | 'delayed',
    dueDate: new Date(proj.dueDate),
    tasksCompleted: proj.tasksCompleted,
    tasksTotal: proj.tasksTotal,
    description: proj.description,
  })) || [];

  // Sort projects: at-risk first, then on-track, then delayed
  const sortedProjects = [...projects].sort((a, b) => {
    const statusOrder = { 'at-risk': 0, 'on-track': 1, 'delayed': 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button
          onClick={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      {sortedProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No projects yet</p>
          <button
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-primary transition-all hover:shadow-md"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {project.name}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatusLabel(project.status)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditProject(project)}
                    className="text-gray-400 hover:text-primary transition-colors p-1"
                    title="Edit project"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteProject(project.id, project.name)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    title="Delete project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span className="font-semibold">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Tasks */}
              <div className="text-sm text-gray-600 mb-4">
                {project.tasksCompleted} / {project.tasksTotal} tasks completed
              </div>

              {/* Due Date */}
              <div className="text-sm text-gray-500 mb-4">
                Due: {project.dueDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>

              {/* View Details Link */}
              <Link
                to={`/projects/${project.id}`}
                className="flex items-center justify-between text-primary hover:text-primary-dark transition-colors group"
              >
                <span className="font-medium">View Details</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProject}
        editingProject={editingProject}
      />
    </div>
  );
};

export default ProjectsPage;