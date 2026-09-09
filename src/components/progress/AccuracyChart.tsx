'use client';

import React from 'react';
import { SubjectStats } from '@/lib/types';

interface AccuracyChartProps {
  data: SubjectStats[];
}

export default function AccuracyChart({ data }: AccuracyChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-gray-500 bg-white/5 rounded-2xl border border-white/10">
        No accuracy data available yet
      </div>
    );
  }

  // Sort by accuracy descending for better visualization
  const sortedData = [...data].sort((a, b) => b.accuracy - a.accuracy);
  
  // Find max accuracy to scale the bars relative to highest or 100%
  // Using 100 as max to show true percentage
  const maxValue = 100;

  return (
    <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
      <h3 className="text-lg font-bold text-white mb-6">Subject Accuracy</h3>
      
      <div className="space-y-4">
        {sortedData.map((stat, index) => {
          const percentage = stat.total > 0 ? stat.accuracy : 0;
          
          return (
            <div key={stat.subject || index} className="w-full">
              <div className="flex justify-between items-end mb-1 text-sm">
                <span className="font-medium text-gray-300 truncate max-w-[70%]">
                  {stat.subject}
                </span>
                <span className="text-gray-400">
                  <span className="text-teal-400 font-bold">{Math.round(percentage)}%</span>
                  <span className="text-xs ml-1 opacity-50">({stat.correct}/{stat.total})</span>
                </span>
              </div>
              
              <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden relative">
                {/* Background track */}
                <div className="absolute inset-0 bg-white/5" />
                
                {/* Fill bar */}
                <div 
                  className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10 text-xs text-gray-500">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
