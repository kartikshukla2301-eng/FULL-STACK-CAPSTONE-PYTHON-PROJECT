import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../services/api';
import { setCredentials } from '../store/authSlice';
import { setToast } from '../store/uiSlice';
import { CheckCircle2, Lock, Mail, User as UserIcon } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('demo@taskflow.com');
  const [password, setPassword] = useState('demo123!');
  const [fullName, setFullName] = useState('Demo User');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await api.post('/auth/register', {
          email,
          password,
          full_name: fullName,
          role: 'developer',
        });
      }

      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const loginRes = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const token = loginRes.data.access_token;
      localStorage.setItem('access_token', token);

      const meRes = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(setCredentials({ user: meRes.data, token }));
      dispatch(setToast({ message: 'Welcome to TaskFlow Pro!', type: 'success' }));
    } catch (err: any) {
      dispatch(
        setToast({
          message: err.response?.data?.detail || 'Authentication failed',
          type: 'error',
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl max-w-md w-full text-white shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <CheckCircle2 className="w-12 h-12 text-sky-400 mb-2" />
          <h2 className="text-2xl font-bold tracking-tight">TaskFlow Pro</h2>
          <p className="text-xs text-sky-200 mt-1">Full-Stack Python Capstone Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-medium text-sky-200 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-sky-300" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-sky-200 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-sky-300" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-sky-200 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-sky-300" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-sky-500 hover:bg-sky-400 font-bold rounded-xl transition text-slate-900 shadow-lg mt-6"
          >
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-sky-300">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="hover:underline font-semibold"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};
