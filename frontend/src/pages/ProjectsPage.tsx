import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';
import { setProjects, setActiveProject } from '../store/taskSlice';
import { setToast } from '../store/uiSlice';
import { Plus, Briefcase, ChevronRight } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { projects, activeProject } = useSelector((state: RootState) => state.tasks);

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    api.get('/projects').then((res) => {
      dispatch(setProjects(res.data));
    }).catch(console.error);
  }, [dispatch]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    api.post('/projects', { name, key, description }).then((res) => {
      dispatch(setProjects([...projects, res.data]));
      dispatch(setToast({ message: 'Project created successfully', type: 'success' }));
      setIsCreating(false);
      setName('');
      setKey('');
      setDescription('');
    }).catch((err) => {
      dispatch(setToast({ message: err.response?.data?.detail || 'Failed to create project', type: 'error' }));
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage team workspaces and project repositories
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl text-sm transition shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> New Project
        </button>
      </div>

      {isCreating && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Project</h3>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Key (e.g. TFP)</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={key}
                  onChange={(e) => setKey(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 text-sm uppercase"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 text-sm"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-sky-600 hover:bg-sky-700 rounded-xl font-medium"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            onClick={() => dispatch(setActiveProject(proj))}
            className={`p-6 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
              activeProject?.id === proj.id
                ? 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-500 shadow-md ring-2 ring-sky-500/20'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 text-xs font-bold bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300 rounded-lg">
                  {proj.key}
                </span>
                <Briefcase className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{proj.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{proj.description || 'No description provided.'}</p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 text-xs font-medium text-sky-600 dark:text-sky-400">
              <span>{activeProject?.id === proj.id ? 'Active Workspace' : 'Select Workspace'}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
