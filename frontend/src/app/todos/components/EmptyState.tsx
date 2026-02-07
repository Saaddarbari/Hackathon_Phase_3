import { PlusCircle, Inbox } from 'lucide-react';

interface EmptyStateProps {
  onAdd?: () => void;
}

export default function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
        <div className="relative bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-50 dark:border-slate-700">
          <Inbox className="w-12 h-12 text-indigo-500" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-xl shadow-lg border-2 border-white dark:border-slate-900">
          <PlusCircle className="w-4 h-4 text-white" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Workspace Clear</h3>
      <p className="text-slate-500 dark:text-slate-400 font-medium text-center max-w-[240px] mb-8">
        Your list is empty. Take a moment to breathe or start planning your next win.
      </p>

      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all active:scale-95"
        >
          Initialize First Task
        </button>
      )}
    </div>
  );
}

