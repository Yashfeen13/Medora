import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getFallbackQuestion } from '@/lib/fallback-questions';
import { isDuplicateQuestion, generateQuestionFingerprint, getTodayDateString } from '@/lib/daily-pool';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const subject = searchParams.get('subject') || 'Physiology';
  const topic = searchParams.get('topic') || 'Blood';
  const mode = searchParams.get('mode') || 'university';
  const excludeParam = searchParams.get('exclude') || '';
  const excludeList = excludeParam ? excludeParam.split(',').filter(Boolean) : [];

  if (!userId || !subject || !topic || !mode) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const todayDate = getTodayDateString();

  try {
    const supabase = createServerSupabaseClient();

    // 1. Fetch attempted questions for user in this Subject + Topic + Mode
    let dbAttemptedIds: string[] = [];
    try {
      const { data: attemptedData } = await supabase
        .from('user_attempts')
        .select('question_id')
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('topic', topic)
        .eq('preparation_mode', mode);

      if (attemptedData) {
        dbAttemptedIds = attemptedData.map(a => a.question_id);
      }
    } catch (e) {
      console.warn('Supabase attempt read warning:', e);
    }

    const allExcludedIds = Array.from(new Set([...dbAttemptedIds, ...excludeList]));

    // 2. Fetch unanswered questions from Supabase for Subject + Topic + Mode
    let unansweredQuestions: any[] = [];
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('subject', subject)
        .eq('topic', topic)
        .eq('preparation_mode', mode);

      const validUuids = allExcludedIds.filter(id => !id.startsWith('fb-') && !id.startsWith('dyn-') && !id.startsWith('medora_'));
      if (validUuids.length > 0) {
        query = query.not('id', 'in', `(${validUuids.join(',')})`);
      }

      const { data } = await query;
      if (data) unansweredQuestions = data;
    } catch (e) {
      console.warn('Supabase questions query warning:', e);
    }

    // 3. Return unattempted question from DB pool if available
    if (unansweredQuestions && unansweredQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
      return NextResponse.json({ question: unansweredQuestions[randomIndex] });
    }

    // 4. Otherwise, generate a unique question for Subject + Mode + Topic + Date from Procedural Engine
    const fallbackQ = getFallbackQuestion(subject, topic, mode, allExcludedIds);
    return NextResponse.json({ question: fallbackQ });
  } catch (error: any) {
    console.warn('Backend error in questions GET, using fallback engine:', error?.message);
    const fallbackQ = getFallbackQuestion(subject, topic, mode, excludeList);
    return NextResponse.json({ question: fallbackQ });
  }
}
