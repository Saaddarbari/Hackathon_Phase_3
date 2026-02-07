const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface TodoCreateRequest {
  title: string;
  description?: string;
}

interface TodoUpdateRequest {
  title?: string;
  description?: string;
}

interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string | null;
}

interface ErrorResponse {
  detail: string;
}

// Helper to get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

// Helper to make authenticated API calls
async function apiCall(url: string, options?: RequestInit): Promise<Response> {
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies
  });
}

export async function createTodo(title: string, description?: string): Promise<Todo> {
  const response = await apiCall(`${API_URL}/todos`, {
    method: 'POST',
    body: JSON.stringify({ title, description } as TodoCreateRequest),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.detail || 'Failed to create todo');
  }

  return response.json();
}

export async function getTodos(): Promise<Todo[]> {
  const response = await apiCall(`${API_URL}/todos`);

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.detail || 'Failed to fetch todos');
  }

  return response.json();
}

export async function getTodo(id: string): Promise<Todo> {
  const response = await apiCall(`${API_URL}/todos/${id}`);

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.detail || 'Failed to fetch todo');
  }

  return response.json();
}

export async function updateTodo(id: string, title: string, description?: string): Promise<Todo> {
  const response = await apiCall(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, description } as TodoUpdateRequest),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.detail || 'Failed to update todo');
  }

  return response.json();
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await apiCall(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.detail || 'Failed to delete todo');
  }
}

export async function toggleTodoComplete(id: string): Promise<Todo> {
  const response = await apiCall(`${API_URL}/todos/${id}/complete`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.detail || 'Failed to toggle todo');
  }

  return response.json();
}
