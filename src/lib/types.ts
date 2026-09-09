// ============================================
// Medora — Type Definitions
// ============================================

export interface Question {
  id: string;
  subject: string;
  topic: string;
  preparation_mode: 'university' | 'usmle';
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  incorrect_explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question_status: 'pending' | 'approved' | 'rejected';
  source_reference: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  created_at: string;
  last_active_at: string;
}

export interface UserAttempt {
  id: string;
  user_id: string;
  question_id: string;
  selected_answer: 'A' | 'B' | 'C' | 'D';
  is_correct: boolean;
  subject: string;
  topic: string;
  preparation_mode: string;
  attempted_at: string;
}

export interface UserAttemptWithQuestion extends UserAttempt {
  questions: Question;
}

export interface SubjectInfo {
  name: string;
  icon: string;
  description: string;
  color: string;
  topics: string[];
}

export interface DailyStats {
  date: string;
  total: number;
  correct: number;
  incorrect: number;
  accuracy: number;
}

export interface SubjectStats {
  subject: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface TopicStats {
  topic: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface OverallStats {
  totalAttempts: number;
  totalCorrect: number;
  totalIncorrect: number;
  overallAccuracy: number;
  currentStreak: number;
  todayStats: DailyStats;
  subjectStats: SubjectStats[];
}

export interface GeneratedMCQ {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  incorrect_explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
