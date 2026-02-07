'use client';

import { useState, FormEvent } from 'react';

interface EditTodoFormProps {
  onSubmit: (title: string, description?: string) => Promise<void>;
  initialTitle: string;
  initialDescription?: string;
}

export default function EditTodoForm({
  onSubmit,
  initialTitle,
  initialDescription,
}: EditTodoFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription || '');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // T090: Implement edit form validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setError('');

    try {
      await onSubmit(title, description);
      // Note: Parent handles redirect
    } catch (err: any) {
      // T091: Display edit todo errors
      setError(err.message || 'Failed to update todo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Edit Todo</h2>

      {/* T091: Display edit todo errors */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="todo-title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="todo-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="What needs to be done?"
            required
          />
        </div>

        <div>
          <label htmlFor="todo-description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            id="todo-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows={5}
            placeholder="Add more details..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium transition"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
