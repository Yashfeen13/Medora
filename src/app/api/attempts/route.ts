import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, questionId, selectedAnswer, isCorrect, subject, topic, preparationMode } = body;

    if (!userId || !questionId || !selectedAnswer || isCorrect === undefined || !subject || !topic || !preparationMode) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
      const supabase = createServerSupabaseClient();

      const { data, error } = await supabase
        .from('user_attempts')
        .insert({
          user_id: userId,
          question_id: questionId.startsWith('fb-') ? '00000000-0000-0000-0000-000000000000' : questionId,
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
          subject,
          topic,
          preparation_mode: preparationMode,
        })
        .select()
        .single();

      if (error) {
        console.warn('Attempt save warning (Supabase not connected/schema missing):', error.message);
      }

      return NextResponse.json({ attempt: data || { id: 'local', is_correct: isCorrect } });
    } catch (dbError) {
      console.warn('DB error on attempt POST:', dbError);
      return NextResponse.json({ attempt: { id: 'local', is_correct: isCorrect } });
    }
  } catch (error: any) {
    console.error('Error in attempts POST:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const subject = searchParams.get('subject');
    const isCorrect = searchParams.get('isCorrect');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    try {
      const supabase = createServerSupabaseClient();
      
      let query = supabase
        .from('user_attempts')
        .select(`
          *,
          questions (*)
        `)
        .eq('user_id', userId)
        .order('attempted_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (subject) {
        query = query.eq('subject', subject);
      }
      
      if (isCorrect !== null && isCorrect !== '') {
        query = query.eq('is_correct', isCorrect === 'true');
      }

      const { data, error, count } = await query;

      if (error) {
        console.warn('Attempts GET warning:', error.message);
        return NextResponse.json({ attempts: [], count: 0 });
      }

      return NextResponse.json({ attempts: data || [], count: count || 0 });
    } catch (dbError) {
      console.warn('DB error on attempts GET:', dbError);
      return NextResponse.json({ attempts: [], count: 0 });
    }
  } catch (error: any) {
    console.error('Error in attempts GET:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
