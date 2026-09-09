'use client';

import React, { useEffect, useState } from 'react';

interface StreakDisplayProps {
  streak: number;
}

export default function StreakDisplay({ streak }: StreakDisplayProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger pop animation on mount if streak > 0
    if (streak > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [streak]);

  if (streak === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full">
        <div className="text-4xl opacity-50 grayscale mb-2">🔥</div>
        <div className="text-gray-400 font-medium">No active streak</div>
        <div className="text-xs text-gray-500 mt-1">Practice today to start one!</div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-b from-orange-500/20 to-red-600/10 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-6 flex flex-col items-center justify-center h-full overflow-hidden group">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.2),transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className={`relative z-10 flex flex-col items-center ${isAnimating ? 'animate-[bounce_1s_ease-in-out]' : ''}`}>
        <div className="relative">
          <span className="text-6xl filter drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]">🔥</span>
          
          {/* Flame particles */}
          <div className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-orange-400 animate-ping" />
          <div className="absolute top-4 -left-3 w-1.5 h-1.5 rounded-full bg-red-400 animate-ping delay-300" />
        </div>
        
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-300 to-red-500 filter drop-shadow-md">
            {streak}
          </span>
        </div>
        
        <span className="text-orange-200/80 font-bold tracking-widest uppercase text-sm mt-1">
          Day Streak
        </span>
      </div>
    </div>
  );
}
