-- ============================================
-- Medora — MBBS MCQ Preparation Platform
-- Database Schema (Supabase / PostgreSQL)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  preparation_mode TEXT NOT NULL CHECK (preparation_mode IN ('university', 'usmle')),
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  explanation TEXT NOT NULL,
  incorrect_explanation TEXT DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_status TEXT NOT NULL DEFAULT 'pending' CHECK (question_status IN ('pending', 'approved', 'rejected')),
  source_reference TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraint to prevent duplicate questions
ALTER TABLE questions ADD CONSTRAINT questions_unique_constraint
  UNIQUE (subject, topic, preparation_mode, question);

-- Indexes for fast lookups
CREATE INDEX idx_questions_subject ON questions(subject);
CREATE INDEX idx_questions_topic ON questions(topic);
CREATE INDEX idx_questions_prep_mode ON questions(preparation_mode);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_status ON questions(question_status);
CREATE INDEX idx_questions_subject_topic_mode ON questions(subject, topic, preparation_mode);

-- ============================================
-- 2. USERS TABLE (Anonymous)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. USER ATTEMPTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  preparation_mode TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for user attempt queries
CREATE INDEX idx_attempts_user ON user_attempts(user_id);
CREATE INDEX idx_attempts_question ON user_attempts(question_id);
CREATE INDEX idx_attempts_correct ON user_attempts(is_correct);
CREATE INDEX idx_attempts_date ON user_attempts(attempted_at);
CREATE INDEX idx_attempts_user_subject ON user_attempts(user_id, subject);
CREATE INDEX idx_attempts_user_date ON user_attempts(user_id, attempted_at);

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================
-- Disable RLS for now (no auth — anonymous access via anon key)
-- When auth is added later, enable RLS and add policies

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_attempts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access (anon key) for all operations
CREATE POLICY "Allow anonymous read questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert questions" ON questions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous read users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update users" ON users FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous read attempts" ON user_attempts FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert attempts" ON user_attempts FOR INSERT WITH CHECK (true);
