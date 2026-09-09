'use client';

import React from 'react';
import { SubjectInfo } from '@/lib/types';
import { ChevronRight, BarChart2, CheckCircle2 } from 'lucide-react';

interface SubjectCardProps {
  subject: SubjectInfo;
  questionsCount?: number;
  accuracy?: number;
  stats?: { total: number; accuracy: number };
  onClick: () => void;
}

export default function SubjectCard({ subject, questionsCount, accuracy, stats, onClick }: SubjectCardProps) {
  const count = questionsCount ?? stats?.total ?? 0;
  const acc = accuracy ?? stats?.accuracy ?? 0;

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
      style={{
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Top Accent Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1" 
        style={{ backgroundColor: subject.color }}
      />
      
      {/* Hover Glow */}
      <div 
        className="absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: subject.color }}
      />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-black/20"
            style={{ color: subject.color }}
          >
            {subject.icon}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
              {subject.name}
            </h3>
            <p className="text-xs text-gray-400 line-clamp-1">{subject.description}</p>
          </div>
        </div>
        
        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>{count} <span className="hidden sm:inline">Q&apos;s Done</span></span>
        </div>
        
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <BarChart2 className="w-4 h-4 text-teal-400" />
          <span>{acc}% <span className="hidden sm:inline">Accuracy</span></span>
        </div>
      </div>
    </div>
  );
}
