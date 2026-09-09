'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId, getUserName, setUserName, isUserOnboarded } from '@/lib/user';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [state, setState] = useState<'input' | 'welcome'>('input');
  const [name, setName] = useState('');
  const [savedName, setSavedName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isUserOnboarded()) {
      setIsOnboarded(true);
      router.replace('/dashboard');
    }
  }, [router]);

  if (!mounted || isOnboarded) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsLoading(true);
    const userId = getUserId();
    
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, name: name.trim() })
      });
    } catch (error) {
      console.error('Error saving user:', error);
    }
    
    setUserName(name.trim());
    setSavedName(name.trim());
    setState('welcome');
    setIsLoading(false);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0A0F1C]">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1C] via-[#0f172a] to-[#0a192f] animate-gradient-xy opacity-80" />
      
      {/* Floating Particles / Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[15%] w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] right-[15%] w-48 h-48 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-[40%] right-[25%] text-blue-500/20 text-4xl animate-float">🧬</div>
        <div className="absolute bottom-[30%] left-[25%] text-teal-500/20 text-4xl animate-float delay-500">🩺</div>
        <div className="absolute top-[15%] right-[40%] text-indigo-500/20 text-4xl animate-float delay-700">🧠</div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl shadow-2xl transition-all duration-500">
        {state === 'input' ? (
          <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                Welcome to Medora
              </h1>
              <p className="text-slate-400 text-lg">
                Your AI-powered companion for MBBS exam preparation
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="space-y-2 text-left">
                <label htmlFor="name" className="text-sm font-medium text-slate-300 ml-1">
                  What should we call you?
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Smith..."
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                  autoFocus
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!name.trim() || isLoading}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Loading...' : 'Continue'} &rarr;
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-8 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 p-[2px] mb-4">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl">
                👋
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Welcome, {savedName}
              </h1>
              <p className="text-slate-400 text-lg">
                Ready to strengthen your medical knowledge?
              </p>
            </div>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              Start Practicing &rarr;
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
