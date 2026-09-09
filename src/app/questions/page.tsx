'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUserId, isUserOnboarded, getLocalAttempts, LocalAttempt } from '@/lib/user';
import TTSButton from '@/components/quiz/TTSButton';
import { SUBJECTS } from '@/lib/constants';
import { Question } from '@/lib/types';
import { XCircle, ChevronDown, ChevronUp, RotateCcw, HelpCircle } from 'lucide-react';

interface DisplayAttempt {
  id: string;
  user_id: string;
  question_id: string;
  selected_answer: 'A' | 'B' | 'C' | 'D';
  is_correct: boolean;
  subject: string;
  topic: string;
  preparation_mode: string;
  attempted_at: string;
  questions: Question;
}

function QuestionCard({ attempt }: { attempt: DisplayAttempt }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const q = attempt.questions;

  if (!q) return null;

  const options = [
    { letter: 'A', text: q.option_a },
    { letter: 'B', text: q.option_b },
    { letter: 'C', text: q.option_c },
    { letter: 'D', text: q.option_d },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-300">
      <div 
        className="p-4 md:p-5 cursor-pointer hover:bg-white/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="badge-blue">
              {attempt.subject}
            </span>
            <span className="badge">
              {attempt.topic}
            </span>
            {!attempt.is_correct && (
              <span className="badge-red flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                Incorrect
              </span>
            )}
            <span className="text-xs text-gray-500">
              {new Date(attempt.attempted_at).toLocaleDateString()}
            </span>
          </div>
          <p className={`text-gray-200 font-medium ${!isExpanded ? 'line-clamp-2' : ''}`}>{q.question}</p>
        </div>
        <div className="text-gray-400 self-end md:self-center">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 md:p-6 border-t border-white/10 bg-black/20 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map(({ letter, text }) => {
              const isSelected = attempt.selected_answer === letter;
              const isCorrectOption = q.correct_answer === letter;
              
              let btnClass = "p-3.5 rounded-xl border text-sm text-left flex items-start gap-2.5 ";
              
              if (isCorrectOption) {
                btnClass += "border-teal-500/50 bg-teal-500/10 text-teal-300";
              } else if (isSelected && !isCorrectOption) {
                btnClass += "border-red-500/50 bg-red-500/10 text-red-300";
              } else {
                btnClass += "border-white/5 bg-white/5 text-gray-400";
              }

              return (
                <div key={letter} className={btnClass}>
                  <span className="font-bold flex-shrink-0 w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-xs">
                    {letter}
                  </span>
                  <span>{text}</span>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl glass border-blue-500/20 relative space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Explanation</h4>
              <TTSButton text={q.explanation} />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{q.explanation}</p>

            {q.incorrect_explanation && !attempt.is_correct && (
              <div className="pt-3 border-t border-white/10">
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Concept Clarification</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{q.incorrect_explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionBankContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'incorrect' ? 'incorrect' : 'incorrect';
  
  const [activeTab, setActiveTab] = useState<'incorrect' | 'correct'>(initialTab);
  const [attempts, setAttempts] = useState<DisplayAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<string>('');

  useEffect(() => {
    if (!isUserOnboarded()) {
      router.push('/');
    }
  }, [router]);

  const loadAttemptsData = async (pageNum: number, reset: boolean = false) => {
    if (reset) setIsLoading(true);
    const userId = getUserId();
    const isCorrectTarget = activeTab === 'correct';

    // 1. Load Local Attempts
    const localList = getLocalAttempts();
    const filteredLocal = localList.filter(a => {
      if (a.isCorrect !== isCorrectTarget) return false;
      if (subjectFilter && a.subject !== subjectFilter) return false;
      return true;
    });

    const localMapped: DisplayAttempt[] = filteredLocal.map(loc => ({
      id: loc.id,
      user_id: loc.userId,
      question_id: loc.questionId,
      selected_answer: loc.selectedAnswer as any,
      is_correct: loc.isCorrect,
      subject: loc.subject,
      topic: loc.topic,
      preparation_mode: loc.preparationMode,
      attempted_at: loc.attemptedAt,
      questions: {
        id: loc.questionId,
        subject: loc.subject,
        topic: loc.topic,
        preparation_mode: loc.preparationMode as any,
        question: loc.questionText || 'Medical Question',
        option_a: loc.options?.[0] || 'Option A',
        option_b: loc.options?.[1] || 'Option B',
        option_c: loc.options?.[2] || 'Option C',
        option_d: loc.options?.[3] || 'Option D',
        correct_answer: (loc.correctAnswer as any) || 'A',
        explanation: loc.explanation || 'Medical rationale provided for this question.',
        incorrect_explanation: 'Review core medical concepts.',
        difficulty: 'medium',
        question_status: 'approved',
        source_reference: 'Medora Bank',
        created_at: loc.attemptedAt,
      },
    }));

    // 2. Fetch Server Attempts
    let serverMapped: DisplayAttempt[] = [];
    try {
      let url = `/api/attempts?userId=${userId}&isCorrect=${isCorrectTarget}&limit=50`;
      if (subjectFilter) url += `&subject=${encodeURIComponent(subjectFilter)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.attempts) {
          serverMapped = data.attempts.filter((a: any) => a.questions);
        }
      }
    } catch (err) {
      console.warn('Failed server attempts load:', err);
    }

    // Combine local and server (unique by ID or question_id + attempted_at)
    const combined = [...localMapped];
    serverMapped.forEach(s => {
      if (!combined.some(c => c.question_id === s.question_id && c.attempted_at === s.attempted_at)) {
        combined.push(s);
      }
    });

    // Sort descending by attempted_at
    combined.sort((a, b) => new Date(b.attempted_at).getTime() - new Date(a.attempted_at).getTime());

    setAttempts(combined);
    setIsLoading(false);
  };

  useEffect(() => {
    setPage(1);
    loadAttemptsData(1, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, subjectFilter]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 pb-24 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Question Bank</h1>
          <p className="text-gray-400">Review your past attempts and master missed concepts.</p>
        </div>
        
        {activeTab === 'incorrect' && attempts.length > 0 && (
          <button 
            onClick={() => {
              const url = subjectFilter 
                ? `/practice/quiz?mode=mistakes&subject=${encodeURIComponent(subjectFilter)}`
                : `/practice/quiz?mode=mistakes`;
              router.push(url);
            }}
            className="btn-primary"
          >
            <RotateCcw className="w-4 h-4" /> Practice My Mistakes
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
            Incorrect ({attempts.length})
          </span>
        </div>

        <select 
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="input-medical w-full sm:w-56"
        >
          <option value="">All Subjects</option>
          {SUBJECTS.map(s => (
            <option key={s.name} value={s.name} className="bg-slate-900 text-white">
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl border border-white/10"></div>
          ))}
        </div>
      ) : attempts.length === 0 ? (
        <div className="py-16 text-center border border-white/10 rounded-2xl glass border-dashed space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-3xl">
            <HelpCircle className="w-8 h-8 text-gray-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">No questions found</h3>
            <p className="text-gray-400 text-sm">
              No wrong questions recorded! Keep up the good work.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {attempts.map(attempt => (
            <QuestionCard key={attempt.id} attempt={attempt} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function QuestionBankPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>}>
      <QuestionBankContent />
    </Suspense>
  );
}
