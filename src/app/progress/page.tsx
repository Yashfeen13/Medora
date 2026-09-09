'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId, isUserOnboarded, getLocalProgress } from '@/lib/user';
import AccuracyChart from '@/components/progress/AccuracyChart';
import StreakDisplay from '@/components/progress/StreakDisplay';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { BookOpen, CheckCircle, XCircle, Target, Award, TrendingUp, Brain } from 'lucide-react';

interface ProgressData {
  today: {
    total: number;
    correct: number;
    incorrect: number;
    accuracy: number;
  };
  overall: {
    total: number;
    accuracy: number;
    streak: number;
  };
  subjects: Array<{
    subject: string;
    total: number;
    correct: number;
    accuracy: number;
  }>;
}

export default function ProgressPage() {
  const router = useRouter();
  const [data, setData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isUserOnboarded()) {
      router.push('/');
      return;
    }

    const loadProgress = async () => {
      const local = getLocalProgress();
      let combined: ProgressData = {
        today: local.today,
        overall: {
          total: local.overall.total,
          accuracy: local.overall.accuracy,
          streak: local.overall.streak,
        },
        subjects: local.subjects,
      };

      try {
        const userId = getUserId();
        const res = await fetch(`/api/progress?userId=${userId}`);
        if (res.ok) {
          const resData = await res.json();
          const serverToday = resData?.today || resData?.stats?.todayStats;
          const serverOverall = resData?.overall || resData?.stats;
          const serverSubjects = resData?.subjects || resData?.stats?.subjectStats || [];

          if (serverOverall && serverOverall.total > combined.overall.total) {
            combined = {
              today: serverToday || combined.today,
              overall: {
                total: serverOverall.total || combined.overall.total,
                accuracy: serverOverall.accuracy || combined.overall.accuracy,
                streak: serverOverall.streak || combined.overall.streak,
              },
              subjects: serverSubjects.length > 0 ? serverSubjects : combined.subjects,
            };
          }
        }
      } catch (err) {
        console.warn('Server progress fetch warning, using local progress:', err);
      }

      setData(combined);
      setIsLoading(false);
    };

    loadProgress();
  }, [router]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 p-4 pb-24">
        <LoadingSkeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <LoadingSkeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <LoadingSkeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!data || data.overall.total === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 pb-24">
        <EmptyState
          icon={<BookOpen className="w-12 h-12 text-blue-400" />}
          title="No progress yet"
          description="Start practicing to see your progress and performance analytics!"
          actionLabel="Start Practicing"
          onAction={() => router.push('/subjects')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 p-4 pb-24 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Your Progress</h1>
        <p className="text-gray-400">Track your performance and learning journey.</p>
      </div>

      {/* Section 1: Today's Summary */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Today&apos;s Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Questions" value={data.today.total} icon={<Brain className="w-5 h-5" />} color="#3B82F6" />
          <StatCard title="Correct" value={data.today.correct} icon={<CheckCircle className="w-5 h-5" />} color="#14B8A6" />
          <StatCard title="Incorrect" value={data.today.incorrect} icon={<XCircle className="w-5 h-5" />} color="#EF4444" />
          <StatCard title="Accuracy" value={`${data.today.accuracy}%`} icon={<Target className="w-5 h-5" />} color="#8B5CF6" />
        </div>
      </section>

      {/* Section 2: Overall Performance */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Overall Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center hover-lift">
            <Award className="w-8 h-8 text-blue-400 mb-3" />
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Attempted</span>
            <span className="text-4xl font-bold text-white">{data.overall.total}</span>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center hover-lift">
            <TrendingUp className="w-8 h-8 text-teal-400 mb-3" />
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Overall Accuracy</span>
            <span className="text-4xl font-bold text-teal-400">{data.overall.accuracy}%</span>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center hover-lift">
            <StreakDisplay streak={data.overall.streak} />
          </div>
        </div>
      </section>

      {/* Section 3: Subject Performance */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-white">Subject Performance</h2>
        
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="mb-8">
            <AccuracyChart data={data.subjects} />
          </div>
          
          <div className="space-y-4">
            {data.subjects.map(subject => (
              <div key={subject.subject} className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-200">{subject.subject}</span>
                  <span className="text-gray-400">{subject.accuracy}% ({subject.correct}/{subject.total})</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${subject.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
