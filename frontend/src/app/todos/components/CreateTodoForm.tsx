'use client';

import { useState, FormEvent } from 'react';
import { Send, AlertCircle, Sparkles } from 'lucide-react';

interface CreateTodoFormProps {
  onSubmit: (title: string, description?: string) => Promise<void>;
  disabled?: boolean;
}

export default function CreateTodoForm({ onSubmit, disabled = false }: CreateTodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setError('');

    try {
      await onSubmit(title, description);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to create todo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm animate-in fade-in zoom-in-95">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="group">
          <label htmlFor="todo-title" className="block text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-2 ml-1 uppercase tracking-wider">
            Task Name
          </label>
          <div className="relative">
            <input
              id="todo-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={disabled}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
              placeholder="What needs to be done?"
              required
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="todo-description" className="block text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-2 ml-1 uppercase tracking-wider">
            Description
          </label>
          <textarea
            id="todo-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={disabled}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white placeholder:text-slate-400 resize-none"
            rows={3}
            placeholder="Add some context..."
          />
        </div>

        <button
          type="submit"
          disabled={disabled || !title.trim()}
          className="w-full bg-indigo-600 text-white py-3.5 px-6 rounded-2xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/30 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none active:scale-[0.98]"
        >
          {disabled ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Launch Task
            </>
          )}
        </button>
      </div>
    </form>
  );
}

