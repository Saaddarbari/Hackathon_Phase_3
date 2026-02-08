/**
 * Hybrid Task Dashboard
 *
 * Combines manual task management with AI chatbot assistance.
 * Users can manage tasks manually OR through the AI chatbot.
 */

'use client';

import { useState, useEffect } from 'react';
import { Plus, MessageSquare, X, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TaskList from './TaskList';
import ChatbotSidebar from './ChatbotSidebar';
import * as taskService from '@/services/task';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

interface TaskDashboardProps {
  userId: string;
  userEmail?: string;
}

export default function TaskDashboard({ userId, userEmail }: TaskDashboardProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load tasks from backend (placeholder - implement API call)
  useEffect(() => {
    loadTasks();
  }, [userId]);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Keep existing tasks on error
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    setIsLoading(true);
    try {
      const newTask = await taskService.createTask({
        title: newTaskTitle,
      });

      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const toggleTaskComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedTask = await taskService.toggleTaskComplete(taskId, !task.completed);
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleAITaskAction = async (action: { type: 'add' | 'delete' | 'complete'; task?: Task; taskId?: string }) => {
    try {
      switch (action.type) {
        case 'add':
          if (action.task) {
            // AI already created the task object, add it to backend
            const newTask = await taskService.createTask({
              title: action.task.title,
            });
            setTasks([...tasks, newTask]);
          }
          break;
        case 'delete':
          if (action.taskId) {
            await deleteTask(action.taskId);
          }
          break;
        case 'complete':
          if (action.taskId) {
            await toggleTaskComplete(action.taskId);
          }
          break;
      }
    } catch (error) {
      console.error('Error handling AI task action:', error);
      alert('Failed to process AI action. Please try again.');
    }
  };

  const handleSignout = () => {
    localStorage.removeItem('access_token');
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
            <p className="text-sm text-gray-600">{userEmail}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              {isChatOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
            </button>
            <button
              onClick={handleSignout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Task Area */}
          <div className={`${isChatOpen ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
            {/* Add Task Input */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Enter task title..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={addTask}
                  disabled={isLoading || !newTaskTitle.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </button>
              </div>
            </div>

            {/* Task List */}
            <TaskList
              tasks={tasks}
              onDelete={deleteTask}
              onToggleComplete={toggleTaskComplete}
            />
          </div>

          {/* AI Chatbot Sidebar */}
          {isChatOpen && (
            <div className="lg:col-span-1">
              <ChatbotSidebar
                userId={userId}
                tasks={tasks}
                onTaskAction={handleAITaskAction}
                onTasksChanged={loadTasks}
                onClose={() => setIsChatOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
