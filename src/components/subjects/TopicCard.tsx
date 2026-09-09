'use client';

import React from 'react';

interface TopicCardProps {
  topic: string;
  onClick: () => void;
}

export default function TopicCard({ topic, onClick }: TopicCardProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group flex items-center justify-between"
    >
      <span className="text-gray-300 group-hover:text-white font-medium text-sm md:text-base">
        {topic}
      </span>
      <span className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
