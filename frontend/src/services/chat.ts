/**
 * Chat API Service
 *
 * Handles communication with the Phase III chat endpoint.
 *
 * Constitutional Compliance:
 * - All task operations flow through single chat endpoint
 * - No direct task CRUD API calls
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7689/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  timestamp: string;
}

/**
 * Send a message to the chat endpoint
 */
export async function sendChatMessage(
  userId: string,
  message: string,
  conversationId?: string
): Promise<ChatResponse> {
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/${userId}/chat`, {
    method: 'POST',
    headers,
    credentials: 'include', // Include cookies for authentication
    body: JSON.stringify({
      message,
      conversation_id: conversationId || null,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Failed to send message');
  }

  return response.json();
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<{ id: string; email: string } | null> {
  try {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    if (!token) {
      return null;
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
