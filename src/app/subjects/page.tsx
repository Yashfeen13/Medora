'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId, isUserOnboarded, getLocalProgress } from '@/lib/user';
import { SUBJECTS } from '@/lib/constants';
import { Search } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import SubjectCard from '@/components/subjects/SubjectCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function SubjectsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectStatsMap, setSubjectStatsMap] = useState<Record<string, { total: number; accuracy: number }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!isUserOnboarded()) {
      router.replace('/');
      return;
    }
    
    const loadSubjectStats = async () => {
      const local = getLocalProgress();
      const localMap: Record<string, { total: number; accuracy: number }> = {};
      local.subjects.forEach(s => {
        localMap[s.subject] = { total: s.total, accuracy: s.accuracy };
      });

      try {
        const res = await fetch(`/api/progress?userId=${getUserId()}`);
        if (res.ok) {
          const data = await res.json();
          const serverSubjects = data?.subjects || data?.stats?.subjectStats || [];
          serverSubjects.forEach((s: any) => {
            const loc = localMap[s.subject] || { total: 0, accuracy: 0 };
            localMap[s.subject] = {
              total: Math.max(loc.total, s.total || 0),
              accuracy: loc.total >= (s.total || 0) ? loc.accuracy : (s.accuracy || 0),
            };
          });
        }
      } catch (error) {
        console.warn('Failed to fetch server stats for subjects, using local:', error);
      }

      setSubjectStatsMap(localMap);
      setIsLoading(false);
    };
    
    loadSubjectStats();
  }, [router]);

  if (!mounted) return null;

  const filteredSubjects = SUBJECTS.filter(subject => 
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer>
      <div className="space-y-8 py-8 animate-fade-in pb-24">
        <header className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Choose Your Subject</h1>
          <p className="text-slate-400 text-lg">Select a subject to start practicing</p>
          
          <div className="relative max-w-md mt-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects..."
              className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
            />
          </div>
        </header>

        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <LoadingSkeleton key={i} className="h-48 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject, index) => {
                  const stat = subjectStatsMap[subject.name] || { total: 0, accuracy: 0 };
                  
                  return (
                    <div 
                      key={subject.name} 
                      className="animate-fade-in-up" 
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <SubjectCard
                        subject={subject}
                        stats={stat}
                        onClick={() => router.push(`/practice/mode?subject=${encodeURIComponent(subject.name)}`)}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-12 text-center text-slate-400">
                  <p>No subjects found matching &quot;{searchQuery}&quot;</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
