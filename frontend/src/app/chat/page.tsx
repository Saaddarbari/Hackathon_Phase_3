/**
 * Chat Page
 *
 * Main page for Phase III chat interface.
 * Replaces Phase II form-based todo management.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TaskDashboard from '@/components/TaskDashboard';
import { getCurrentUser } from '@/services/chat';

export default function ChatPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          // Not authenticated, redirect to signin
          router.push('/signin');
          return;
        }

        setUserId(user.id);
        setUserEmail(user.email);
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/signin');
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return null; // Will redirect to signin
  }

  return <TaskDashboard userId={userId} userEmail={userEmail || undefined} />;
}
