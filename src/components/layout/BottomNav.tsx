'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Play, BarChart3, CheckCircle } from 'lucide-react';
import { isUserOnboarded } from '@/lib/user';

export default function BottomNav() {
  const pathname = usePathname();
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    setIsOnboarded(isUserOnboarded());
  }, []);

  const homePath = isOnboarded ? '/dashboard' : '/';

  const tabs = [
    { name: 'Home', path: homePath, icon: Home },
    { name: 'Subjects', path: '/subjects', icon: BookOpen },
    { name: 'Practice', path: '/subjects', icon: Play },
    { name: 'Progress', path: '/progress', icon: BarChart3 },
    { name: 'Questions', path: '/questions', icon: CheckCircle },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full z-50 bg-[#0A0F1C]/80 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActuallyActive = 
            pathname === tab.path || 
            (tab.name === 'Home' && (pathname === '/' || pathname === '/dashboard')) ||
            (tab.path !== '/' && tab.path !== '/dashboard' && pathname.startsWith(tab.path));

          return (
            <Link
              key={tab.name}
              href={tab.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActuallyActive ? 'text-teal-400' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActuallyActive ? 'stroke-2' : 'stroke-[1.5]'}`} />
              <span className="text-[10px] font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
