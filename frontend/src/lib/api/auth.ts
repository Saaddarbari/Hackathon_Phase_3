const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface SignupRequest {
  email: string;
  password: string;
}

interface SigninRequest {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface ErrorResponse {
  detail: string;
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify({ email, password } as SignupRequest),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.detail || 'Signup failed');
  }

  return response.json();
}

export async function signin(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for session
    body: JSON.stringify({ email, password } as SigninRequest),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.detail || 'Signin failed');
  }

  const data = await response.json();

  // Store token in cookie (T042)
  // Note: In a real app, the server should set the cookie via Set-Cookie header
  // For client-side storage (demo), we'll store in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.access_token);
  }

  return data;
}

export async function signout(): Promise<void> {
  // Clear stored token
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }

  // T111: Handle session by redirecting to /signin
  // This is typically done by removing the cookie
  // which will cause the next request to fail
  // triggering a redirect
}
