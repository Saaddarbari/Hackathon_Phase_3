'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

export default function Toast({ message, type = 'info', duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!isVisible && !message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-indigo-500" />,
  };

  const styles = {
    success: 'border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20',
    error: 'border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20',
    info: 'border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/20',
  };

  return (
    <div
      className={`fixed top-6 right-6 z-[100] transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
        }`}
    >
      <div className={`flex items-center gap-3 px-6 py-4 rounded-[22px] border backdrop-blur-xl shadow-2xl shadow-black/5 ${styles[type]}`}>
        <div className="flex-shrink-0 animate-in zoom-in-50 duration-300">
          {icons[type]}
        </div>
        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
          {message}
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
        >
          <X className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
        </button>
      </div>
    </div>
  );
}
