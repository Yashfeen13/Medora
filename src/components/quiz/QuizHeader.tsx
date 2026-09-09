import React from 'react';
import Link from 'next/link';
import { X, ChevronRight } from 'lucide-react';

interface QuizHeaderProps {
  subject: string;
  topic?: string;
  mode: string;
  questionNumber: number;
  totalAnswered: number;
}

export default function QuizHeader({ subject, topic, mode, questionNumber, totalAnswered }: QuizHeaderProps) {
  const modeLabel = mode === 'university' ? 'Univ Prep' : 'USMLE';
  
  return (
    <div className="w-full max-w-4xl mx-auto mb-6 flex items-center justify-between">
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
          {subject}
        </span>
        {topic && (
          <>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span className="truncate max-w-[120px] sm:max-w-[200px]">{topic}</span>
          </>
        )}
        <ChevronRight className="w-4 h-4 opacity-50 hidden sm:block" />
        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
          {modeLabel}
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-xs text-gray-500">Question</div>
          <div className="font-bold text-white">{questionNumber}</div>
        </div>
        
        <Link 
          href="/practice" 
          className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Exit Session"
        >
          <X className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
