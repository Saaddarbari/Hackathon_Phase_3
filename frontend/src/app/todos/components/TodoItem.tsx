'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateTodo, deleteTodo, toggleTodoComplete } from '@/lib/api/todos';
import { Trash2, Edit3, CheckCircle2, Circle, AlertCircle, Clock, Calendar } from 'lucide-react';

interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string | null;
}

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
}

export default function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggle = async () => {
    try {
      setError('');
      await toggleTodoComplete(todo.id);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle todo');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      setError('');
      await deleteTodo(todo.id);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to delete todo');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEdit = () => {
    router.push(`/todos/${todo.id}/edit`);
  };

  const formattedDate = new Date(todo.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={`group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 dark:hover:border-indigo-900/40 ${todo.completed ? 'opacity-75' : ''}`}>
      {error && (
        <div className="absolute -top-3 left-4 right-4 p-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-1 z-10">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}

      <div className="flex gap-5">
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 w-8 h-8 rounded-xl border-2 transition-all flex items-center justify-center active:scale-90 ${todo.completed
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600'
            }`}
        >
          {todo.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700 hover:text-indigo-400 transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className={`text-[17px] font-bold transition-all truncate ${todo.completed
                ? 'text-slate-400 dark:text-slate-600 line-through decoration-slate-400/50'
                : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
              }`}>
              {todo.title}
            </h3>

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{formattedDate}</span>
            </div>
          </div>

          {todo.description && (
            <p className={`text-sm mb-4 leading-relaxed line-clamp-2 ${todo.completed
                ? 'text-slate-400 dark:text-slate-600'
                : 'text-slate-600 dark:text-slate-400 font-medium'
              }`}>
              {todo.description}
            </p>
          )}

          <div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-indigo-950/20 rounded-lg text-xs font-bold transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Modify
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-red-950/20 rounded-lg text-xs font-bold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl p-8 max-w-[340px] w-full border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">Discard Task?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center text-sm font-medium mb-8">
              This will permanently remove the task from your workspace. This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent active:scale-95"
              >
                No, Keep it
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200 dark:shadow-none active:scale-95 flex items-center justify-center gap-2"
              >
                {isDeleting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Yes, Discard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

