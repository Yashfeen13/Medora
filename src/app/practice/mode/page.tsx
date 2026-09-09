'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PREPARATION_MODES, getSubjectByName } from '@/lib/constants';
import PageContainer from '@/components/layout/PageContainer';
import ModeCard from '@/components/subjects/ModeCard';
import { ArrowLeft } from 'lucide-react';

function PracticeModeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get('subject');
  
  const subject = subjectParam ? getSubjectByName(subjectParam) : null;

  if (!subject) {
    return (
      <div className="py-20 text-center text-white">
        <p className="text-xl text-slate-400 mb-6">Subject not found.</p>
        <button 
          onClick={() => router.push('/subjects')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
        >
          Go back to Subjects
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8 animate-fade-in max-w-4xl mx-auto">
      <button 
        onClick={() => router.push('/subjects')}
        className="flex items-center text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to subjects
      </button>

      <header className="space-y-4 text-center pb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-3xl mb-2 backdrop-blur-md">
          {subject.icon}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          What are you preparing for?
        </h1>
        <p className="text-slate-400 text-lg">
          Choose your preparation mode for {subject.name}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {PREPARATION_MODES.map((mode, index) => (
          <div 
            key={mode.id} 
            className="animate-fade-in-up" 
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ModeCard
              mode={mode}
              onClick={() => router.push(`/practice/topic?subject=${encodeURIComponent(subject.name)}&mode=${mode.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PracticeModePage() {
  return (
    <PageContainer>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      }>
        <PracticeModeContent />
      </Suspense>
    </PageContainer>
  );
}
