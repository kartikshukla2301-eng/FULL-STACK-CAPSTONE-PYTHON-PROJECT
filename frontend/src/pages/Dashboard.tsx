import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';
import { setTasks } from '../store/taskSlice';
import { AnalyticsData } from '../types';
import { CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';
import { AnalyticsChart } from '../components/AnalyticsChart';

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { activeProject, tasks } = useSelector((state: RootState) => state.tasks);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (activeProject) {
      api.get(`/tasks?project_id=${activeProject.id}`).then((res) => {
        dispatch(setTasks(res.data));
      }).catch(console.error);

      api.get(`/analytics/project/${activeProject.id}`).then((res) => {
        setAnalytics(res.data);
      }).catch(console.error);
    }
  }, [activeProject, dispatch]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Project Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview metrics for {activeProject?.name || 'Active Project'}
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalTasks}</p>
          </div>
          <div className="p-3 bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Completed</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{completedTasks}</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">In Progress</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{inProgressTasks}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Urgent Tasks</p>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{urgentTasks}</p>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts */}
      {analytics && <AnalyticsChart data={analytics} />}
    </div>
  );
};
