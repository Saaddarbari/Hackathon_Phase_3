/**
 * Phase II Todos Page - Deprecated
 *
 * This page is deprecated in Phase III.
 * All task operations now flow through the chat interface.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, ArrowRight } from 'lucide-react';

export default function TodosDeprecatedPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/chat');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        {/* Icon */}
        <div className="mb-6 inline-flex p-4 bg-blue-100 rounded-full">
          <MessageSquare className="w-12 h-12 text-blue-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Welcome to Phase III! 🚀
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-6">
          We've upgraded to an <span className="font-semibold text-blue-600">agent-first architecture</span>.
          Task management is now powered by natural language conversation.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-semibold text-gray-900 mb-3">What's Changed:</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>No more forms - just chat naturally with your AI assistant</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Say "Add buy groceries" instead of filling out forms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>All task operations via MCP tools (constitutional compliance)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Stateless server with conversation history from database</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Go to Chat Interface
          <ArrowRight className="w-5 h-5" />
        </Link>

        <p className="mt-4 text-sm text-gray-500">
          Redirecting automatically in 5 seconds...
        </p>
      </div>
    </div>
  );
}
