// ============================================
// Medora — Daily Question Pool & Deduplication Manager
// ============================================

import { Question } from './types';

export interface PoolQuestion extends Question {
  fingerprint: string;
  createdDate: string; // YYYY-MM-DD
}

export interface PoolStorage {
  date: string;
  subject: string;
  topic: string;
  mode: string;
  questions: PoolQuestion[];
}

/**
 * Get current date string in YYYY-MM-DD format (local timezone)
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Text Normalization for exact & fuzzy duplicate checking
 */
export function normalizeQuestionText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, '') // remove punctuation
    .replace(/\s+/g, ' ')     // collapse whitespace
    .trim();
}

/**
 * Generate a simple hash/fingerprint for a normalized question string
 */
export function generateQuestionFingerprint(questionText: string): string {
  const normalized = normalizeQuestionText(questionText);
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `fp_${Math.abs(hash)}_${normalized.slice(0, 20).replace(/\s+/g, '_')}`;
}

/**
 * Calculate Jaccard similarity between two strings (word token overlap)
 */
export function getSimilarityRatio(str1: string, str2: string): number {
  const words1 = new Set(normalizeQuestionText(str1).split(' ').filter(w => w.length > 2));
  const words2 = new Set(normalizeQuestionText(str2).split(' ').filter(w => w.length > 2));

  if (words1.size === 0 || words2.size === 0) return 0;

  let intersection = 0;
  words1.forEach(w => {
    if (words2.has(w)) intersection++;
  });

  const union = new Set([...Array.from(words1), ...Array.from(words2)]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Check if a candidate question is a duplicate of any existing question in the pool
 */
export function isDuplicateQuestion(candidateText: string, existingPool: Question[]): boolean {
  const normCandidate = normalizeQuestionText(candidateText);
  if (!normCandidate) return true;

  for (const existing of existingPool) {
    const normExisting = normalizeQuestionText(existing.question);
    
    // 1. Exact normalized match
    if (normCandidate === normExisting) {
      return true;
    }

    // 2. High word overlap (similarity > 0.85 = substantially identical question)
    if (getSimilarityRatio(normCandidate, normExisting) > 0.85) {
      return true;
    }
  }

  return false;
}

/**
 * Construct composite storage key: medora_pool_{subject}_{mode}_{topic}_{date}
 */
export function getPoolStorageKey(subject: string, mode: string, topic: string, dateStr?: string): string {
  const date = dateStr || getTodayDateString();
  const cleanSubj = subject.trim().toLowerCase().replace(/\s+/g, '_');
  const cleanMode = mode.trim().toLowerCase().replace(/\s+/g, '_');
  const cleanTop = topic.trim().toLowerCase().replace(/\s+/g, '_');
  return `medora_pool_${cleanSubj}_${cleanMode}_${cleanTop}_${date}`;
}

/**
 * Retrieve the daily question pool from localStorage (Client-Side)
 */
export function getLocalDailyPool(subject: string, mode: string, topic: string, dateStr?: string): PoolQuestion[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = getPoolStorageKey(subject, mode, topic, dateStr);
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: PoolStorage = JSON.parse(raw);
    return parsed.questions || [];
  } catch (e) {
    console.error('Error reading daily question pool:', e);
    return [];
  }
}

/**
 * Save / Update the daily question pool in localStorage
 */
export function saveLocalDailyPool(
  subject: string,
  mode: string,
  topic: string,
  questions: Question[],
  dateStr?: string
): PoolQuestion[] {
  if (typeof window === 'undefined') return [];
  const date = dateStr || getTodayDateString();
  const key = getPoolStorageKey(subject, mode, topic, date);

  // Format and deduplicate questions
  const existingPool = getLocalDailyPool(subject, mode, topic, date);
  const poolMap = new Map<string, PoolQuestion>();

  // Add existing valid items to map
  existingPool.forEach(q => {
    const fp = q.fingerprint || generateQuestionFingerprint(q.question);
    poolMap.set(fp, { ...q, fingerprint: fp });
  });

  // Add new non-duplicate questions
  questions.forEach(q => {
    const fp = generateQuestionFingerprint(q.question);
    if (!poolMap.has(fp) && !isDuplicateQuestion(q.question, Array.from(poolMap.values()))) {
      poolMap.set(fp, {
        ...q,
        id: q.id || `pool_${fp}_${Date.now()}`,
        subject,
        topic,
        preparation_mode: mode as any,
        fingerprint: fp,
        createdDate: date,
      });
    }
  });

  const updatedPool = Array.from(poolMap.values());

  try {
    const payload: PoolStorage = {
      date,
      subject,
      topic,
      mode,
      questions: updatedPool,
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (e) {
    console.error('Error writing daily question pool:', e);
  }

  return updatedPool;
}

/**
 * Ensure daily pool has at least targetCount (e.g. 100) unique questions.
 * Pre-populates pool using generatorFn if count < targetCount.
 */
export function ensureLocalDailyPool(
  subject: string,
  mode: string,
  topic: string,
  generatorFn: (attemptedIds: string[]) => Question,
  targetCount: number = 100
): PoolQuestion[] {
  if (typeof window === 'undefined') return [];
  let pool = getLocalDailyPool(subject, mode, topic);

  if (pool.length >= targetCount) {
    return pool;
  }

  const attemptedList = pool.map(q => q.id);
  const newQuestions: Question[] = [];

  let safetyLoop = 0;
  while (pool.length + newQuestions.length < targetCount && safetyLoop < 150) {
    safetyLoop++;
    const nextExcluded = [...attemptedList, ...newQuestions.map(q => q.id)];
    const candidate = generatorFn(nextExcluded);
    
    if (candidate && candidate.question) {
      if (!isDuplicateQuestion(candidate.question, [...pool, ...newQuestions])) {
        newQuestions.push(candidate);
      }
    }
  }

  if (newQuestions.length > 0) {
    pool = saveLocalDailyPool(subject, mode, topic, newQuestions);
  }

  return pool;
}
