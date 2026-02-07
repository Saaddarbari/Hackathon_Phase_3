'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTodos, createTodo } from '@/lib/api/todos';
import TodoList from '@/app/todos/components/TodoList';
import CreateTodoForm from '@/app/todos/components/CreateTodoForm';
import EmptyState from '@/app/todos/components/EmptyState';
import { LogOut, CheckCircle2, Layout, Plus, Loader2 } from 'lucide-react';

interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string | null;
}

export default function TodosPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/signin');
    } else {
      loadTodos();
    }
  }, [router]);

  const loadTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load todos');
      setLoading(false);
    }
  };

  const handleCreateTodo = async (title: string, description?: string) => {
    try {
      await createTodo(title, description);
      await loadTodos();
      setIsAdding(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create todo');
    }
  };

  const handleSignout = () => {
    localStorage.removeItem('access_token');
    router.push('/signin');
  };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-500">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400">
                Workspace
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Manage your tasks and boost your productivity.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                {completedCount} / {todos.length} Completed
              </div>
              <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                  style={{ width: `${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleSignout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Error Handling */}
        {error && (
          <div className="mb-6 animate-in slide-in-from-top-4 duration-300">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-medium text-sm">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Your Tasks</h2>
              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 transition-all active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  New Task
                </button>
              )}
            </div>

            <div className="space-y-6">
              {isAdding && (
                <div className="animate-in zoom-in-95 duration-200 border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-3xl p-2">
                  <div className="bg-white dark:bg-slate-900 rounded-[22px] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900 dark:text-white">Create New Task</h3>
                      <button
                        onClick={() => setIsAdding(false)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                    <CreateTodoForm onSubmit={handleCreateTodo} disabled={loading} />
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Prepping your workspace...</p>
                </div>
              ) : todos.length === 0 ? (
                <EmptyState onAdd={() => setIsAdding(true)} />
              ) : (
                <TodoList todos={todos} onUpdate={loadTodos} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Status Bar Area */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 py-3 px-6 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-[13px] font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              System Online
            </span>
            <span className="opacity-50">|</span>
            <span>{todos.length} Tasks Total</span>
          </div>
          <div className="hidden sm:block">
            Built by SAAD DARBARI 
          </div>
        </div>
      </footer>
    </div>
  );
}

