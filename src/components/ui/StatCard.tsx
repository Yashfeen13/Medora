'use client';

import React, { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, subtitle, icon, color = '#3B82F6', className = '', trend }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState<number | string>(typeof value === 'number' ? 0 : value);

  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const end = value;
      if (start === end) {
        setDisplayValue(end);
        return;
      }
      
      const duration = 1000;
      const incrementTime = 20;
      const steps = duration / incrementTime;
      const increment = (end - start) / steps;

      const timer = setInterval(() => {
        start += increment;
        if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
          clearInterval(timer);
          setDisplayValue(end);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, incrementTime);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 transition-transform duration-300 hover:-translate-y-1 ${className}`}
      style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {icon && (
            <div 
              className="p-3 rounded-xl bg-white/5"
              style={{ color }}
            >
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{displayValue}</span>
              {trend && (
                <span className={`text-sm font-medium ${trend.isPositive ? 'text-teal-400' : 'text-red-400'}`}>
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </div>
      
      {/* Subtle background glow based on color */}
      <div 
        className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
