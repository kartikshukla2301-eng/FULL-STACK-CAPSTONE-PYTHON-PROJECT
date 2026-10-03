import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import { toggleDarkMode } from '../store/uiSlice';
import { Sun, Moon, LogOut, CheckCircle2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useSelector((state: RootState) => state.ui);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <CheckCircle2 className="w-8 h-8 text-sky-600 dark:text-sky-400" />
        <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          TaskFlow <span className="text-sky-600 dark:text-sky-400">Pro</span>
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {user && (
          <div className="flex items-center space-x-3 border-l pl-4 border-gray-200 dark:border-gray-700">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.full_name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <button
              onClick={() => dispatch(logout())}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
