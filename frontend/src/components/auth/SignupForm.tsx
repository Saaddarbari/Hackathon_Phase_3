'use client';

import { useState, FormEvent } from 'react';
import { Mail, Lock, UserPlus, Loader2, AlertCircle } from 'lucide-react';

interface SignupFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export default function SignupForm({ onSubmit }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSubmit(email, password);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm animate-in fade-in zoom-in-95">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="group">
          <label htmlFor="email" className="block text-[13px] font-bold text-white/40 dark:text-slate-400 mb-2 ml-1 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white placeholder:text-slate-400 font-medium"
              placeholder="name@example.com"
              required
            />
          </div>
        </div>

        <div className="group">
          <label htmlFor="password" className="block text-[13px] font-bold text-white/40 dark:text-slate-400 mb-2 ml-1 uppercase tracking-wider">
            Create Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white placeholder:text-slate-400 font-medium"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter ml-1">
            Minimum 8 Characters Required
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white py-4 px-6 rounded-2xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/30 font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-[0.98] flex items-center justify-center gap-2 group"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <UserPlus className="w-5 h-5 transition-transform group-hover:scale-110" />
            Deploy Account
          </>
        )}
      </button>
    </form>
  );
}

