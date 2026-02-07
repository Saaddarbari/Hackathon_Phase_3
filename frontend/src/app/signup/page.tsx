'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signup } from '@/lib/api/auth';
import SignupForm from '@/components/auth/SignupForm';
import { Layout, AlertCircle, FileCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const handleSignup = async (email: string, password: string) => {
    try {
      setError('');
      await signup(email, password);
      router.push('/signin');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-24 selection:bg-indigo-500/30 dark:bg-slate-950 px-4 relative overflow-hidden transition-colors duration-500">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-[440px] w-full relative z-10">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center bg-indigo-600 p-3 rounded-2xl shadow-md shadow-indigo-200 dark:shadow-none mb-6">
            <FileCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r  from-indigo-400 via-purple-400 to-pink-400">
            Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-indigo-500 to-purple-500">Account</span>
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium text-lg">
            Start your journey with the next generation of productivity.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-[22px] text-sm flex items-center gap-3 animate-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        <div className="bg-slate-800 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-10 rounded-[40px] shadow-2xl shadow-indigo-500/5">
          <SignupForm onSubmit={handleSignup} />
        </div>

        <div className="my-10 text-center">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Already registered?{' '}
            <Link href="/signin" className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors underline underline-offset-4">
              Access Vault
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
