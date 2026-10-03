import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import api from './services/api';
import { setCredentials } from './store/authSlice';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { NotificationToast } from './components/NotificationToast';
import { Dashboard } from './pages/Dashboard';
import { ProjectsPage } from './pages/ProjectsPage';
import { KanbanPage } from './pages/KanbanPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api.get('/users/me').then((res) => {
        dispatch(setCredentials({ user: res.data, token }));
      }).catch(() => {
        localStorage.removeItem('access_token');
      });
    }
  }, [dispatch]);

  if (!isAuthenticated) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <LoginPage />
        <NotificationToast />
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/kanban" element={<KanbanPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <NotificationToast />
      </div>
    </div>
  );
};

export default App;
