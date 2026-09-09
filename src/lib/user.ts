// ============================================
// Medora — Anonymous User & Local Progress Storage
// ============================================

'use client';

import { v4 as uuidv4 } from 'uuid';
import { Question } from './types';

const USER_ID_KEY = 'medora_user_id';
const USER_NAME_KEY = 'medora_user_name';
const ATTEMPTS_KEY = 'medora_user_attempts_v1';

export interface LocalAttempt {
  id: string;
  userId: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  subject: string;
  topic: string;
  preparationMode: string;
  attemptedAt: string;
  questionText?: string;
  explanation?: string;
  correctAnswer?: string;
  options?: string[];
}

export function getUserId(): string {
  if (typeof window === 'undefined') return '';
  
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export function getUserName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(USER_NAME_KEY) || '';
}

export function setUserName(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_NAME_KEY, name);
}

export function isUserOnboarded(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(USER_NAME_KEY);
}

export function clearUserData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(ATTEMPTS_KEY);
}

// ── Local Attempts Storage & Progress Calculations ──

export function getLocalAttempts(): LocalAttempt[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading local attempts:', e);
    return [];
  }
}

export function saveLocalAttempt(attempt: Omit<LocalAttempt, 'id' | 'attemptedAt'> & { question?: Question }): LocalAttempt {
  if (typeof window === 'undefined') return { ...attempt, id: uuidv4(), attemptedAt: new Date().toISOString() };
  
  const attempts = getLocalAttempts();
  const q = attempt.question;
  
  const newAttempt: LocalAttempt = {
    id: uuidv4(),
    userId: attempt.userId,
    questionId: attempt.questionId,
    selectedAnswer: attempt.selectedAnswer,
    isCorrect: attempt.isCorrect,
    subject: attempt.subject,
    topic: attempt.topic,
    preparationMode: attempt.preparationMode,
    attemptedAt: new Date().toISOString(),
    questionText: q?.question,
    explanation: q?.explanation,
    correctAnswer: q?.correct_answer,
    options: q ? [q.option_a, q.option_b, q.option_c, q.option_d] : [],
  };

  attempts.unshift(newAttempt);
  try {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts.slice(0, 500))); // Keep last 500 attempts
  } catch (e) {
    console.error('Error saving local attempt:', e);
  }

  return newAttempt;
}

export function resolveIncorrectAttempt(questionId: string, questionText?: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const attempts = getLocalAttempts();
    let updated = false;
    const updatedAttempts = attempts.map(a => {
      if (!updated && !a.isCorrect && (a.questionId === questionId || (questionText && a.questionText === questionText))) {
        updated = true;
        return { ...a, isCorrect: true };
      }
      return a;
    });

    if (updated) {
      localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(updatedAttempts));
      return true;
    }
  } catch (e) {
    console.error('Error resolving incorrect attempt:', e);
  }
  return false;
}

export function getLocalProgress() {
  const attempts = getLocalAttempts();
  const todayStr = new Date().toISOString().split('T')[0];

  const total = attempts.length;
  const correct = attempts.filter(a => a.isCorrect).length;
  const incorrect = total - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const todayAttempts = attempts.filter(a => a.attemptedAt && a.attemptedAt.split('T')[0] === todayStr);
  const todayTotal = todayAttempts.length;
  const todayCorrect = todayAttempts.filter(a => a.isCorrect).length;
  const todayIncorrect = todayTotal - todayCorrect;
  const todayAccuracy = todayTotal > 0 ? Math.round((todayCorrect / todayTotal) * 100) : 0;

  // Streak Calculation
  let streak = 0;
  const uniqueDates = Array.from(new Set(attempts.map(a => a.attemptedAt ? a.attemptedAt.split('T')[0] : ''))).filter(Boolean).sort().reverse();
  
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  if (uniqueDates.length > 0 && (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr)) {
    streak = 1;
    let checkDate = new Date(uniqueDates[0]);
    for (let i = 1; i < uniqueDates.length; i++) {
      checkDate.setDate(checkDate.getDate() - 1);
      const expected = checkDate.toISOString().split('T')[0];
      if (uniqueDates[i] === expected) {
        streak++;
      } else {
        break;
      }
    }
  }

  // Subject Breakdown
  const subjectMap = new Map<string, { total: number; correct: number }>();
  attempts.forEach(a => {
    if (!a.subject) return;
    const cur = subjectMap.get(a.subject) || { total: 0, correct: 0 };
    subjectMap.set(a.subject, {
      total: cur.total + 1,
      correct: cur.correct + (a.isCorrect ? 1 : 0),
    });
  });

  const subjectStats = Array.from(subjectMap.entries()).map(([subj, stats]) => ({
    subject: subj,
    total: stats.total,
    correct: stats.correct,
    accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));

  return {
    today: {
      total: todayTotal,
      correct: todayCorrect,
      incorrect: todayIncorrect,
      accuracy: todayAccuracy,
    },
    overall: {
      total,
      correct,
      incorrect,
      accuracy,
      streak,
    },
    subjects: subjectStats,
  };
}
