'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId, getUserName, isUserOnboarded, getLocalProgress } from '@/lib/user';
import { Brain, Target, TrendingUp, Flame, BookOpen, BarChart3, AlertCircle } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import StatCard from '@/components/ui/StatCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState<{
    todayTotal: number;
    todayAccuracy: number;
    overallAccuracy: number;
    streak: number;
  }>({
    todayTotal: 0,
    todayAccuracy: 0,
    overallAccuracy: 0,
    streak: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!isUserOnboarded()) {
      router.replace('/');
      return;
    }
    
    setUserName(getUserName());
    
    const loadDashboardStats = async () => {
      // 1. Get local progress first
      const local = getLocalProgress();
      let mergedStats = {
        todayTotal: local.today.total,
        todayAccuracy: local.today.accuracy,
        overallAccuracy: local.overall.accuracy,
        streak: local.overall.streak,
      };

      // 2. Fetch server stats
      try {
        const res = await fetch(`/api/progress?userId=${getUserId()}`);
        if (res.ok) {
          const data = await res.json();
          const serverToday = data?.today?.total || data?.stats?.todayStats?.total || 0;
          const serverTodayAcc = data?.today?.accuracy || data?.stats?.todayStats?.accuracy || 0;
          const serverOverallAcc = data?.overall?.accuracy || data?.stats?.overallAccuracy || 0;
          const serverStreak = data?.overall?.streak || data?.stats?.currentStreak || 0;

          // Merge (take max of local and server)
          mergedStats = {
            todayTotal: Math.max(local.today.total, serverToday),
            todayAccuracy: local.today.total >= serverToday ? local.today.accuracy : serverTodayAcc,
            overallAccuracy: local.overall.total >= (data?.overall?.total || 0) ? local.overall.accuracy : serverOverallAcc,
            streak: Math.max(local.overall.streak, serverStreak),
          };
        }
      } catch (error) {
        console.warn('Failed to fetch remote server stats, using local progress:', error);
      }

      setStats(mergedStats);
      setIsLoading(false);
    };
    
    loadDashboardStats();
  }, [router]);

  if (!mounted) return null;

  return (
    <PageContainer>
      <div className="space-y-8 animate-fade-in pb-12">
        <header className="pt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">{userName}</span> 👋
          </h1>
          <p className="text-slate-400">Here&apos;s an overview of your medical preparation journey.</p>
        </header>

        {/* Stats Grid */}
        <section>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <LoadingSkeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Today's Questions"
                value={stats.todayTotal.toString()}
                icon={<Brain className="w-6 h-6 text-blue-400" />}
                className="bg-blue-500/10 border-blue-500/20"
              />
              <StatCard
                title="Today's Accuracy"
                value={`${stats.todayAccuracy}%`}
                icon={<Target className="w-6 h-6 text-teal-400" />}
                className="bg-teal-500/10 border-teal-500/20"
              />
              <StatCard
                title="Overall Accuracy"
                value={`${stats.overallAccuracy}%`}
                icon={<TrendingUp className="w-6 h-6 text-purple-400" />}
                className="bg-purple-500/10 border-purple-500/20"
              />
              <StatCard
                title="Current Streak"
                value={`${stats.streak} 🔥`}
                icon={<Flame className="w-6 h-6 text-orange-400" />}
                className="bg-orange-500/10 border-orange-500/20"
              />
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => router.push('/subjects')}
              className="flex flex-col p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-blue-900/40 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] group text-left cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Start Practicing</h3>
              <p className="text-slate-400 text-sm">Choose a subject and begin solving MCQs</p>
            </button>

            <button
              onClick={() => router.push('/progress')}
              className="flex flex-col p-6 rounded-3xl bg-gradient-to-br from-teal-600/20 to-teal-900/40 border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(20,184,166,0.15)] group text-left cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">My Progress</h3>
              <p className="text-slate-400 text-sm">View your performance analytics and stats</p>
            </button>

            <button
              onClick={() => router.push('/questions')}
              className="flex flex-col p-6 rounded-3xl bg-gradient-to-br from-orange-600/20 to-orange-900/40 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(249,115,22,0.15)] group text-left cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Review Mistakes</h3>
              <p className="text-slate-400 text-sm">Learn from your previously incorrect answers</p>
            </button>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
