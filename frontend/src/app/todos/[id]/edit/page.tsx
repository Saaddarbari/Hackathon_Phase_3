'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getTodo, updateTodo } from '@/lib/api/todos';

interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string | null;
}

export default function EditTodoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // T089: Pre-populate form with existing todo data
  useEffect(() => {
    const loadTodo = async () => {
      if (!params.id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const todo = await getTodo(params.id);
        setTitle(todo.title);
        setDescription(todo.description || '');
        setLoading(false);
      } catch (err: any) {
        if (err.message?.includes('not found')) {
          setNotFound(true);
        } else {
          setError(err.message || 'Failed to load todo');
        }
        setLoading(false);
      }
    };

    loadTodo();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // T090: Implement edit form validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setError('');

    try {
      await updateTodo(params.id, title, description);
      // T092: Implement redirect to /todos after successful edit
      router.push('/todos');
    } catch (err: any) {
      // T091: Display edit todo errors
      setError(err.message || 'Failed to update todo');
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Not Found</h1>
          <p className="text-gray-600 mb-8">The todo you're looking for doesn't exist or you don't have access to it.</p>
          <Link
            href="/todos"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Back to My Todos
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <Link
            href="/todos"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7 7-7 7" />
            </svg>
            Back to Todos
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">Edit Todo</h1>
        </header>

        {/* T109: Backend error handling for 404, 401, 403, 500 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="What needs to be done?"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                rows={5}
                placeholder="Add more details..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
