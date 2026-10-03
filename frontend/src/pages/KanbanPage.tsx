import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';
import { setTasks, addTask, updateTaskInState } from '../store/taskSlice';
import { setToast } from '../store/uiSlice';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskModal } from '../components/TaskModal';
import { Task, TaskStatus } from '../types';
import { Plus, Download } from 'lucide-react';
import { wsService } from '../services/websocket';

export const KanbanPage: React.FC = () => {
  const dispatch = useDispatch();
  const { activeProject, tasks } = useSelector((state: RootState) => state.tasks);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (activeProject) {
      api.get(`/tasks?project_id=${activeProject.id}`).then((res) => {
        dispatch(setTasks(res.data));
      }).catch(console.error);

      // Connect WebSocket real-time channel
      wsService.connect(activeProject.id);
      wsService.onMessage((msg) => {
        if (msg.event === 'task_updated') {
          dispatch(updateTaskInState(msg.data));
        }
      });

      return () => wsService.disconnect();
    }
  }, [activeProject, dispatch]);

  const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
    api.patch(`/tasks/${taskId}`, { status: newStatus }).then((res) => {
      dispatch(updateTaskInState(res.data));
      wsService.send({ event: 'task_updated', data: res.data });
    }).catch(console.error);
  };

  const handleCreateOrUpdate = (data: any) => {
    if (editingTask) {
      api.patch(`/tasks/${editingTask.id}`, data).then((res) => {
        dispatch(updateTaskInState(res.data));
        dispatch(setToast({ message: 'Task updated', type: 'success' }));
      });
    } else {
      api.post('/tasks', data).then((res) => {
        dispatch(addTask(res.data));
        dispatch(setToast({ message: 'Task created', type: 'success' }));
      });
    }
  };

  const handleExportCSV = () => {
    if (!activeProject) return;
    window.open(`/api/v1/tasks/export/csv?project_id=${activeProject.id}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kanban Board
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Real-time interactive task workflow for {activeProject?.name || 'Active Project'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl text-sm transition shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Task
          </button>
        </div>
      </div>

      <KanbanBoard
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onEditTask={(task) => {
          setEditingTask(task);
          setIsModalOpen(true);
        }}
      />

      {activeProject && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateOrUpdate}
          task={editingTask}
          projectId={activeProject.id}
        />
      )}
    </div>
  );
};
