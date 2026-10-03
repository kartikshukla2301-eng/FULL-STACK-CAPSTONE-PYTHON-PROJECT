import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const SettingsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          User profile and security preferences
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">
          Profile Information
        </h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 font-medium">Full Name</span>
            <p className="text-gray-900 dark:text-white font-semibold">{user?.full_name}</p>
          </div>
          <div>
            <span className="text-gray-500 font-medium">Email Address</span>
            <p className="text-gray-900 dark:text-white font-semibold">{user?.email}</p>
          </div>
          <div>
            <span className="text-gray-500 font-medium">Role</span>
            <p className="text-gray-900 dark:text-white font-semibold capitalize">{user?.role}</p>
          </div>
          <div>
            <span className="text-gray-500 font-medium">Account Status</span>
            <p className="text-emerald-600 font-semibold">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};
