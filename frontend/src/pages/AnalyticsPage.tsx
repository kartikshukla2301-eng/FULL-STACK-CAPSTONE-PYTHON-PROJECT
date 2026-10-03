import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';
import { AnalyticsData } from '../types';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { TrendingUp, Award, Zap } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { activeProject } = useSelector((state: RootState) => state.tasks);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (activeProject) {
      api.get(`/analytics/project/${activeProject.id}`).then((res) => {
        setAnalytics(res.data);
      }).catch(console.error);
    }
  }, [activeProject]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Analytics & Velocity</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Performance metrics and burndown insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase">Completion Rate</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {analytics?.completion_rate || 0}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase">Average Velocity</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white">29 pts/sprint</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase">Quality Score</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white">98/100</p>
        </div>
      </div>

      {analytics && <AnalyticsChart data={analytics} />}
    </div>
  );
};
