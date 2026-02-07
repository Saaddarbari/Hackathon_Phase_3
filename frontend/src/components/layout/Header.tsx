'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Layout, Sparkles, FileCheck } from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-background/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-3 shadow-sm'
        : 'bg-transparent dark:bg-slate-900 py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}    
          <Link
            href="/"
            className="group flex items-center gap-2.5"
          >
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-110">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              TODO <span className="text-indigo-600 dark:text-indigo-400 font-black">APP</span>
            </span>
            
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/signin"
              className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Access Vault
            </Link>
            <Link
              href="/signup"
              className="relative group px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-sm font-bold transition-all shadow-xl hover:shadow-indigo-500/10 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </Link>
          </nav>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white transition-all active:scale-95"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-6 flex flex-col gap-4">
            <Link
              href="/signin"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between text-lg font-bold text-slate-900 dark:text-white p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 transition-all"
            >
              Access Vault
              <X className="w-4 h-4 opacity-0" /> {/* Placeholder/Decorator */}
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="block text-center px-6 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-200 dark:shadow-none"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

