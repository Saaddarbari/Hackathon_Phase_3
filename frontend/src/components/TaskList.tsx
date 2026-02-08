/**
 * TaskList Component
 *
 * Displays a list of tasks with manual controls for delete and mark complete.
 */

'use client';

import { Trash2, Check } from 'lucide-react';
import { Task } from './TaskDashboard';

interface TaskListProps {
  tasks: Task[];
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export default function TaskList({ tasks, onDelete, onToggleComplete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No tasks yet. Add your first task above or use the AI assistant!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Tasks</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-4 rounded-lg border ${
              task.completed
                ? 'bg-gray-50 border-gray-200'
                : 'bg-white border-gray-300 hover:border-blue-400'
            } transition-colors`}
          >
            {/* Checkbox for marking complete */}
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                task.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-blue-500'
              }`}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.completed && <Check className="w-4 h-4 text-white" />}
            </button>

            {/* Task title */}
            <div className="flex-1">
              <p
                className={`${
                  task.completed
                    ? 'text-gray-500 line-through'
                    : 'text-gray-900'
                }`}
              >
                {task.title}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(task.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Delete button */}
            <button
              onClick={() => onDelete(task.id)}
              className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete task"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
