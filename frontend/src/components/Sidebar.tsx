import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, BarChart3, Settings, Briefcase } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: Briefcase },
    { to: '/kanban', label: 'Kanban Board', icon: FolderKanban },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col p-4">
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-800'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
