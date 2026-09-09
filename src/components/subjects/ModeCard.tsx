'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface ModeProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

interface ModeCardProps {
  mode: ModeProps;
  selected?: boolean;
  onClick: () => void;
}

export default function ModeCard({ mode, selected = false, onClick }: ModeCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`relative group p-6 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden bg-white/5 backdrop-blur-md border ${
        selected 
          ? 'shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-2 ring-offset-2 ring-offset-[#0A0F1C]' 
          : 'border-white/10 hover:border-white/20 hover:bg-white/10'
      }`}
      style={selected ? { borderColor: mode.color } : {}}
    >
      {/* Background Glow */}
      <div 
        className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${selected ? 'opacity-10' : 'group-hover:opacity-5'}`}
        style={{ background: `radial-gradient(circle at center, ${mode.color}, transparent)` }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
            style={{ backgroundColor: `${mode.color}20`, color: mode.color }}
          >
            {mode.icon}
          </div>
          <h3 className="text-xl font-bold text-white">{mode.title}</h3>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 min-h-[40px]">
          {mode.description}
        </p>
        
        <ul className="space-y-2">
          {mode.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
              <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: mode.color }} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
