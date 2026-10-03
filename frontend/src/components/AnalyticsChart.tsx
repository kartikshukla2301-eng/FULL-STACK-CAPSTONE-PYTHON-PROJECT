import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { AnalyticsData } from '../types';

interface AnalyticsChartProps {
  data: AnalyticsData;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Velocity Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Sprint Velocity Tracking
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.velocity}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="sprint" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  color: '#fff',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="completed_points" name="Completed" fill="#0284c7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target_points" name="Target" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Burndown Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Burndown Analytics
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.burndown}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  color: '#fff',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="remaining_hours"
                name="Actual Remaining"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="ideal_hours"
                name="Ideal Burndown"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
