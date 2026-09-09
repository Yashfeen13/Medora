'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUserId, saveLocalAttempt, getLocalAttempts, resolveIncorrectAttempt } from '@/lib/user';
import { getRandomMessage, getSubjectByName, PREPARATION_MODES } from '@/lib/constants';
import { Question } from '@/lib/types';
import TTSButton from '@/components/quiz/TTSButton';
import { ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import { getLocalDailyPool, saveLocalDailyPool, ensureLocalDailyPool, getTodayDateString, isDuplicateQuestion } from '@/lib/daily-pool';
import { getFallbackQuestion } from '@/lib/fallback-questions';

interface DisplayOption {
  displayLetter: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect: boolean;
}

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const subjectName = searchParams.get('subject') || '';
  const modeId = searchParams.get('mode') || '';
  const topicName = searchParams.get('topic') || '';

  const isMistakesMode = modeId === 'mistakes' || subjectName.toLowerCase() === 'review' || modeId === 'review';

  const subject = getSubjectByName(subjectName) || {
    name: subjectName || 'Mistakes Review',
    icon: '🎯',
    description: 'Practice previously missed questions',
    color: '#F59E0B',
    topics: ['Mistakes'],
  };

  const mode = isMistakesMode
    ? {
        id: 'mistakes' as const,
        title: 'Practice My Mistakes',
        description: 'Review and correct questions you answered incorrectly.',
        icon: '🔄',
        color: '#F59E0B',
        features: ['Mistake correction', 'Automated retry', 'Targeted practice'],
      }
    : PREPARATION_MODES.find(m => m.id === modeId);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [displayOptions, setDisplayOptions] = useState<DisplayOption[]>([]);
  const [correctDisplayLetter, setCorrectDisplayLetter] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [correctText, setCorrectText] = useState<string>('');
  
  const [attemptedIds, setAttemptedIds] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [poolCount, setPoolCount] = useState(0);

  // Persistence Key for Session attempted IDs
  const sessionAttemptKey = `medora_session_attempted_${subjectName}_${modeId}_${topicName}_${getTodayDateString()}`;

  // Load Attempted IDs from local storage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(sessionAttemptKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setAttemptedIds(parsed);
          setQuestionNumber(parsed.length + 1);
        }
      }
    } catch (e) {
      console.warn('Error reading session attempted IDs:', e);
    }
  }, [sessionAttemptKey]);

  const setupQuestion = (q: Question) => {
    setCurrentQuestion(q);
    
    const rawOptions = [
      { text: q.option_a, isCorrect: q.correct_answer === 'A' },
      { text: q.option_b, isCorrect: q.correct_answer === 'B' },
      { text: q.option_c, isCorrect: q.correct_answer === 'C' },
      { text: q.option_d, isCorrect: q.correct_answer === 'D' },
    ];

    const shuffled = [...rawOptions].sort(() => Math.random() - 0.5);
    const letters: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
    
    let foundCorrectLetter: 'A' | 'B' | 'C' | 'D' = 'A';
    let foundCorrectText = '';

    const formatted: DisplayOption[] = shuffled.map((item, idx) => {
      const letter = letters[idx];
      if (item.isCorrect) {
        foundCorrectLetter = letter;
        foundCorrectText = item.text;
      }
      return {
        displayLetter: letter,
        text: item.text,
        isCorrect: item.isCorrect,
      };
    });

    setDisplayOptions(formatted);
    setCorrectDisplayLetter(foundCorrectLetter);
    setCorrectText(foundCorrectText);
  };

  const fetchQuestion = useCallback(async (currentExcluded: string[]) => {
    setIsLoading(true);
    setError(null);
    setIsAnswered(false);
    setSelectedLetter(null);
    setFeedbackMessage('');

    if (isMistakesMode) {
      const incorrectAttempts = getLocalAttempts().filter(a => !a.isCorrect);
      const filtered = (subjectName && subjectName !== 'Mistakes Review' && subjectName !== 'review')
        ? incorrectAttempts.filter(a => a.subject === subjectName)
        : incorrectAttempts;

      const targetAttempt = filtered.find(a => 
        !currentExcluded.includes(a.questionId) && 
        (!a.questionText || !currentExcluded.includes(a.questionText))
      );

      if (targetAttempt) {
        const q: Question = {
          id: targetAttempt.questionId,
          subject: targetAttempt.subject,
          topic: targetAttempt.topic,
          preparation_mode: targetAttempt.preparationMode as any,
          question: targetAttempt.questionText || 'Medical Question',
          option_a: targetAttempt.options?.[0] || 'Option A',
          option_b: targetAttempt.options?.[1] || 'Option B',
          option_c: targetAttempt.options?.[2] || 'Option C',
          option_d: targetAttempt.options?.[3] || 'Option D',
          correct_answer: (targetAttempt.correctAnswer as any) || 'A',
          explanation: targetAttempt.explanation || 'Detailed medical explanation provided for this question.',
          incorrect_explanation: 'Review core medical concepts.',
          difficulty: 'medium',
          question_status: 'approved',
          source_reference: 'Mistakes Bank',
          created_at: targetAttempt.attemptedAt,
        };
        setupQuestion(q);
      } else {
        setCurrentQuestion(null);
      }
      setIsLoading(false);
      return;
    }
    
    try {
      const userId = getUserId();

      // 1. Guarantee at least 100+ unique questions pre-populated in Local Daily Pool
      const localPool = ensureLocalDailyPool(
        subjectName,
        modeId,
        topicName,
        (excluded) => getFallbackQuestion(subjectName, topicName, modeId, excluded),
        100
      );
      setPoolCount(localPool.length);

      // Find an unattempted question in local pool
      const unattemptedLocal = localPool.find(q => 
        !currentExcluded.includes(q.id) && 
        !currentExcluded.includes(q.question)
      );

      if (unattemptedLocal) {
        setupQuestion(unattemptedLocal);
        setIsLoading(false);
        return;
      }

      // 2. Fetch from API with current exclusions
      const excludeParam = currentExcluded.join(',');
      const res = await fetch(`/api/questions?userId=${userId}&subject=${encodeURIComponent(subjectName)}&topic=${encodeURIComponent(topicName)}&mode=${modeId}&exclude=${encodeURIComponent(excludeParam)}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data.question) {
          const updatedPool = saveLocalDailyPool(subjectName, modeId, topicName, [data.question]);
          setPoolCount(updatedPool.length);
          setupQuestion(data.question);
          setIsLoading(false);
          return;
        }
      }

      // 3. Fallback to procedural generator for continuous unattempted items
      const fallbackQ = getFallbackQuestion(subjectName, topicName, modeId, currentExcluded);
      setupQuestion(fallbackQ);
      setIsLoading(false);
    } catch {
      // Emergency fallback
      const fallbackQ = getFallbackQuestion(subjectName, topicName, modeId, currentExcluded);
      setupQuestion(fallbackQ);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  }, [subjectName, topicName, modeId, isMistakesMode]);

  useEffect(() => {
    fetchQuestion(attemptedIds);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectName, topicName, modeId, isMistakesMode]);

  const handleAnswerSelect = async (chosenOption: DisplayOption) => {
    if (isAnswered || !currentQuestion) return;
    
    setIsAnswered(true);
    setSelectedLetter(chosenOption.displayLetter);
    
    const isCorrect = chosenOption.isCorrect;
    setFeedbackMessage(getRandomMessage(isCorrect));
    
    setTotalAnswered(prev => prev + 1);
    if (isCorrect) setTotalCorrect(prev => prev + 1);

    // Track ID so we never show this question again in this session
    const updatedAttempted = Array.from(new Set([...attemptedIds, currentQuestion.id, currentQuestion.question]));
    setAttemptedIds(updatedAttempted);
    try {
      localStorage.setItem(sessionAttemptKey, JSON.stringify(updatedAttempted));
    } catch (e) {
      console.warn('Error storing session attempted IDs:', e);
    }

    const userId = getUserId();

    if (isMistakesMode) {
      if (isCorrect) {
        // Correct answer in mistakes practice -> mark resolved so incorrect count decreases by 1!
        resolveIncorrectAttempt(currentQuestion.id, currentQuestion.question);
      }
    } else {
      // Save attempt locally to localStorage
      saveLocalAttempt({
        userId,
        questionId: currentQuestion.id,
        selectedAnswer: chosenOption.displayLetter,
        isCorrect,
        subject: subjectName,
        topic: topicName,
        preparationMode: modeId,
        question: currentQuestion,
      });
    }

    // Sync attempt to backend API
    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          questionId: currentQuestion.id,
          selectedAnswer: chosenOption.displayLetter,
          isCorrect,
          subject: currentQuestion.subject || subjectName,
          topic: currentQuestion.topic || topicName,
          preparationMode: currentQuestion.preparation_mode || modeId
        })
      });
    } catch (err) {
      console.warn('Backend attempt sync warning:', err);
    }
  };

  const handleNextQuestion = () => {
    setQuestionNumber(prev => prev + 1);
    const updated = currentQuestion 
      ? Array.from(new Set([...attemptedIds, currentQuestion.id, currentQuestion.question]))
      : attemptedIds;
    fetchQuestion(updated);
  };

  if (!subject || !mode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <h1 className="text-2xl font-bold text-white mb-4">Invalid Selection</h1>
        <button onClick={() => router.push('/subjects')} className="btn-primary">Go Back</button>
      </div>
    );
  }

  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 py-6 pb-24">
      {/* Quiz Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl glass">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/subjects')} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <span>{subject.icon}</span>
              <span>{subject.name}</span>
              <span>•</span>
              <span className="text-white font-medium">{topicName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Question {questionNumber}</span>
              <span className="badge-blue text-xs">{mode.title}</span>
              {poolCount > 0 && (
                <span className="badge-green text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-400" /> {poolCount}+ Daily Pool
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Session Stats */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm text-gray-400">Score</div>
            <div className="text-lg font-semibold text-white">{totalCorrect}/{totalAnswered}</div>
          </div>
          {/* Accuracy Ring */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-gray-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className={accuracy >= 70 ? 'text-teal-500' : accuracy >= 40 ? 'text-yellow-500' : 'text-red-500'} strokeWidth="3" strokeDasharray={`${accuracy}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-xs font-medium text-white">{accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading || isGenerating ? (
        <div className="space-y-6 animate-pulse">
          {isGenerating && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-300">Generating 100+ unique questions for <strong className="text-white">{topicName}</strong> ({mode.title})...</span>
              </div>
            </div>
          )}
          <div className="h-32 bg-white/5 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-2xl glass">
          <p className="text-lg text-gray-300 mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="btn-secondary">
              Finish Practice
            </button>
            <button onClick={() => fetchQuestion(attemptedIds)} className="btn-primary">
              Retry
            </button>
          </div>
        </div>
      ) : currentQuestion ? (
        <div className="space-y-6 animate-fade-in">
          {/* Question */}
          <div className="p-6 md:p-8 rounded-2xl glass">
            {currentQuestion.difficulty && (
              <span className={`inline-block mb-3 text-xs font-medium px-2.5 py-1 rounded-full ${
                currentQuestion.difficulty === 'easy' ? 'badge-green' : 
                currentQuestion.difficulty === 'hard' ? 'badge-red' : 'badge-blue'
              }`}>
                {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
              </span>
            )}
            <p className="text-lg md:text-xl text-gray-100 leading-relaxed">{currentQuestion.question}</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayOptions.map((opt) => {
              const isSelected = selectedLetter === opt.displayLetter;
              const isCorrectOption = isAnswered && opt.isCorrect;
              const isWrongSelected = isSelected && !isCorrectOption;

              let optionClass = 'p-4 md:p-5 rounded-xl border text-left transition-all duration-300 cursor-pointer ';
              
              if (!isAnswered) {
                optionClass += 'option-default';
              } else if (isCorrectOption) {
                optionClass += 'option-correct ' + (isSelected ? 'animate-correct-pulse' : '');
              } else if (isWrongSelected) {
                optionClass += 'option-incorrect animate-incorrect-shake';
              } else {
                optionClass += 'border-white/5 bg-white/[0.02] text-gray-500 opacity-50';
              }

              return (
                <button
                  key={opt.displayLetter}
                  disabled={isAnswered}
                  onClick={() => handleAnswerSelect(opt)}
                  className={optionClass}
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      isCorrectOption ? 'bg-green-500/20 text-green-400' :
                      isWrongSelected ? 'bg-red-500/20 text-red-400' :
                      isAnswered ? 'bg-white/5 text-gray-500' :
                      'bg-white/10 text-gray-300'
                    }`}>
                      {isCorrectOption ? '✓' : isWrongSelected ? '✗' : opt.displayLetter}
                    </span>
                    <span className="pt-1">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Panel */}
          {isAnswered && (
            <div className={`p-6 rounded-2xl border animate-slide-in-bottom ${
              selectedLetter === correctDisplayLetter 
                ? 'border-green-500/30 bg-green-500/5' 
                : 'border-amber-500/30 bg-amber-500/5'
            }`}>
              <div className="flex flex-col gap-4">
                {/* Motivational Message */}
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${
                    selectedLetter === correctDisplayLetter ? 'text-green-400' : 'text-amber-400'
                  }`}>
                    {selectedLetter === correctDisplayLetter ? 'Correct!' : 'Not Quite'}
                  </h3>
                  <p className="text-gray-300">{feedbackMessage}</p>
                </div>

                {/* Show correct answer if wrong */}
                {selectedLetter !== correctDisplayLetter && (
                  <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="text-sm text-green-400 font-medium">
                      Correct Answer: {correctDisplayLetter}. {correctText}
                    </span>
                  </div>
                )}
                
                {/* Explanation */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Explanation</h4>
                    <TTSButton text={currentQuestion.explanation} />
                  </div>
                  <p className="text-gray-200 leading-relaxed">{currentQuestion.explanation}</p>
                  
                  {currentQuestion.incorrect_explanation && selectedLetter !== correctDisplayLetter && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Why Your Answer Was Wrong</h4>
                      <p className="text-gray-300 leading-relaxed">{currentQuestion.incorrect_explanation}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2">
                  <button onClick={() => router.push('/dashboard')} className="btn-secondary">
                    Finish Practice
                  </button>
                  <button onClick={handleNextQuestion} className="btn-primary">
                    Next Question →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : isMistakesMode ? (
        <div className="p-8 text-center rounded-2xl glass space-y-6 animate-fade-in border border-teal-500/20">
          <div className="w-16 h-16 mx-auto rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">All Mistakes Mastered! 🎉</h2>
          <p className="text-gray-300 max-w-md mx-auto">
            You have reviewed all your incorrect questions. Great job expanding your medical knowledge!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <button onClick={() => router.push('/questions?tab=incorrect')} className="btn-secondary">
              Go to Question Bank
            </button>
            <button onClick={() => router.push('/subjects')} className="btn-primary">
              Practice New Topics
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
