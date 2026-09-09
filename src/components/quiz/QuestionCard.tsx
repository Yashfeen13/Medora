'use client';

import React from 'react';
import { Question } from '@/lib/types';
import { Check, X } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  onAnswer: (answer: 'A' | 'B' | 'C' | 'D') => void;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D';
  isAnswered: boolean;
}

export default function QuestionCard({ 
  question, 
  questionNumber, 
  onAnswer, 
  selectedAnswer, 
  isAnswered 
}: QuestionCardProps) {
  
  const options = [
    { id: 'A' as const, text: question.option_a },
    { id: 'B' as const, text: question.option_b },
    { id: 'C' as const, text: question.option_c },
    { id: 'D' as const, text: question.option_d },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 mb-6 shadow-xl">
        <h2 className="text-xl md:text-2xl font-medium text-white leading-relaxed">
          <span className="text-blue-400 font-bold mr-3">{questionNumber}.</span>
          {question.question}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrectAnswer = isAnswered && option.id === question.correct_answer;
          const isWrongSelection = isAnswered && isSelected && option.id !== question.correct_answer;
          
          let buttonClass = "relative flex items-center p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden group ";
          let badgeClass = "flex items-center justify-center w-8 h-8 rounded-lg mr-4 text-sm font-bold transition-colors ";
          
          if (!isAnswered) {
            buttonClass += "border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-white/10";
            badgeClass += "bg-white/10 text-gray-300 group-hover:bg-blue-500/20 group-hover:text-blue-400";
          } else {
            if (isCorrectAnswer) {
              buttonClass += "border-teal-500/50 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.1)]";
              badgeClass += "bg-teal-500 text-white";
            } else if (isWrongSelection) {
              buttonClass += "border-red-500/50 bg-red-500/10";
              badgeClass += "bg-red-500 text-white";
            } else {
              buttonClass += "border-white/5 bg-white/5 opacity-50";
              badgeClass += "bg-white/10 text-gray-400";
            }
          }

          return (
            <button
              key={option.id}
              disabled={isAnswered}
              onClick={() => onAnswer(option.id)}
              className={buttonClass}
            >
              <div className={badgeClass}>
                {option.id}
              </div>
              <span className="text-gray-200 text-sm md:text-base pr-8">{option.text}</span>
              
              {isAnswered && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isCorrectAnswer && <Check className="w-5 h-5 text-teal-400" />}
                  {isWrongSelection && <X className="w-5 h-5 text-red-400" />}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
