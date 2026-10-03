import React from 'react';
import { Task, TaskStatus } from '../types';
import { Clock, AlertCircle } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
}

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: 'border-amber-500' },
  { id: 'in_progress', label: 'In Progress', color: 'border-blue-500' },
  { id: 'in_review', label: 'In Review', color: 'border-purple-500' },
  { id: 'done', label: 'Completed', color: 'border-emerald-500' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onStatusChange,
  onEditTask,
}) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300';
      case 'medium':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className={`bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border-t-4 ${col.color} border-x border-b border-gray-200 dark:border-gray-800 flex flex-col`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                {col.label}
              </h3>
              <span className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full font-medium">
                {columnTasks.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onEditTask(task)}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-semibold uppercase ${getPriorityBadge(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    {task.estimated_hours && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.estimated_hours}h
                      </span>
                    )}
                  </div>

                  <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                    {task.title}
                  </h4>

                  {task.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/50">
                    <select
                      value={task.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        onStatusChange(task.id, e.target.value as TaskStatus)
                      }
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded px-2 py-1 border-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="in_review">In Review</option>
                      <option value="done">Completed</option>
                    </select>
                  </div>
                </div>
              ))}

              {columnTasks.length === 0 && (
                <div className="py-8 text-center text-xs text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                  No tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
