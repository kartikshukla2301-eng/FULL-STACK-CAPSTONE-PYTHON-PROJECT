import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setToast } from '../store/uiSlice';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(setToast(null));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-gray-800 animate-slide-up">
      {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
      {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
      {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}

      <span className="text-sm font-medium pr-2">{toast.message}</span>

      <button
        onClick={() => dispatch(setToast(null))}
        className="text-gray-400 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
