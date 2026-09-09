'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSubjectByName, getTopicsForSubject, PREPARATION_MODES } from '@/lib/constants';
import TopicCard from '@/components/subjects/TopicCard';
import SpeechInput from '@/components/subjects/SpeechInput';

function TopicSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const subjectName = searchParams.get('subject') || '';
  const modeId = searchParams.get('mode') || '';
  
  const subject = getSubjectByName(subjectName);
  const mode = PREPARATION_MODES.find(m => m.id === modeId);
  const topics = getTopicsForSubject(subjectName);
  
  const [customTopic, setCustomTopic] = useState('');

  if (!subject || !mode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-white mb-4">Invalid Selection</h1>
        <button 
          onClick={() => router.push('/subjects')}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleTopicSelect = (topic: string) => {
    router.push(`/practice/quiz?subject=${encodeURIComponent(subjectName)}&mode=${modeId}&topic=${encodeURIComponent(topic)}`);
  };

  const handleCustomTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      handleTopicSelect(customTopic.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 py-8 pb-24">
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Select a Topic</h1>
        <div className="flex items-center justify-center gap-3 text-lg text-gray-400">
          <span className="flex items-center gap-2">
            <span>{subject.icon}</span>
            <span className="text-gray-200">{subject.name}</span>
          </span>
          <span>•</span>
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${mode.color}20`, color: mode.color }}>
            {mode.title}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map((topic, index) => (
          <div key={topic} className="animate-stagger-in" style={{ animationDelay: `${index * 0.05}s` }}>
            <TopicCard topic={topic} onClick={() => handleTopicSelect(topic)} />
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-in-up">
        <h2 className="text-xl font-semibold text-white mb-4">Custom Topic</h2>
        <p className="text-gray-400 text-sm mb-4">Enter any topic or use voice search to find what you want to study</p>
        <form onSubmit={handleCustomTopicSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Enter your own topic... e.g., Brachial Plexus"
              className="input-medical pr-14"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <SpeechInput onResult={(text) => setCustomTopic(text)} />
            </div>
          </div>
          <button
            type="submit"
            disabled={!customTopic.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Start Practice →
          </button>
        </form>
      </div>
    </div>
  );
}

export default function TopicSelectionPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>}>
      <TopicSelectionContent />
    </Suspense>
  );
}
