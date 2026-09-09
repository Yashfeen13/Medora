import React from 'react';

type SkeletonVariant = 'card' | 'text' | 'circle' | 'stat';

interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

export default function LoadingSkeleton({ variant = 'text', className = '' }: LoadingSkeletonProps) {
  const baseClasses = "animate-pulse bg-white/5 rounded-md relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

  if (variant === 'card') {
    return <div className={`${baseClasses} rounded-2xl h-48 w-full ${className}`} />;
  }

  if (variant === 'circle') {
    return <div className={`${baseClasses} rounded-full h-12 w-12 ${className}`} />;
  }

  if (variant === 'stat') {
    return (
      <div className={`${baseClasses} rounded-xl h-24 w-full p-4 flex items-center gap-4 ${className}`}>
        <div className="h-10 w-10 rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-1/2" />
          <div className="h-6 bg-white/10 rounded w-3/4" />
        </div>
      </div>
    );
  }

  // text variant
  return <div className={`${baseClasses} h-4 w-full ${className}`} />;
}
