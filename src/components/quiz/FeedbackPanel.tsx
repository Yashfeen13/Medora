'use client';

import React from 'react';
import TTSButton from './TTSButton';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FeedbackPanelProps {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  incorrectExplanation?: string;
  motivationalMessage: string;
}

export default function FeedbackPanel({ 
  isCorrect, 
  correctAnswer, 
  explanation, 
  incorrectExplanation, 
  motivationalMessage 
}: FeedbackPanelProps) {
  
  const bgColorClass = isCorrect ? 'bg-teal-500/10' : 'bg-red-500/10';
  const borderColorClass = isCorrect ? 'border-teal-500/30' : 'border-red-500/30';
  const iconColorClass = isCorrect ? 'text-teal-400' : 'text-red-400';

  return (
    <div className={`mt-8 w-full max-w-4xl mx-auto rounded-2xl border ${borderColorClass} ${bgColorClass} backdrop-blur-md overflow-hidden animate-in slide-in-from-bottom-4 duration-500`}>
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="mt-1 flex-shrink-0">
            {isCorrect ? (
              <CheckCircle2 className={`w-8 h-8 ${iconColorClass}`} />
            ) : (
              <AlertCircle className={`w-8 h-8 ${iconColorClass}`} />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-1 ${iconColorClass}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h3>
            <p className="text-white font-medium text-lg mb-2">
              {motivationalMessage}
            </p>
            
            {!isCorrect && (
              <div className="mt-4 inline-block px-4 py-2 bg-black/30 rounded-lg border border-white/5">
                <span className="text-gray-400 text-sm">Correct Answer: </span>
                <span className="text-white font-bold text-lg ml-2">{correctAnswer}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 mt-6 pt-6 border-t border-white/10">
          {!isCorrect && incorrectExplanation && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Why it's wrong</h4>
                <TTSButton text={incorrectExplanation} />
              </div>
              <p className="text-gray-300 leading-relaxed bg-black/20 p-4 rounded-xl">
                {incorrectExplanation}
              </p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Explanation</h4>
              <TTSButton text={explanation} />
            </div>
            <p className="text-gray-200 leading-relaxed bg-black/20 p-4 rounded-xl text-base md:text-lg">
              {explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
