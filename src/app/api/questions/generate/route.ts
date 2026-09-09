import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateMCQBatch } from '@/lib/gemini';
import { isDuplicateQuestion, generateQuestionFingerprint, getTodayDateString } from '@/lib/daily-pool';

export async function POST(request: NextRequest) {
  try {
    const { subject, topic, mode, targetCount = 100 } = await request.json();

    if (!subject || !topic || !mode) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const todayDate = getTodayDateString();
    const supabase = createServerSupabaseClient();

    // 1. Fetch existing questions for Subject + Mode + Topic + Date from Supabase
    let existingQuestions: any[] = [];
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subject', subject)
        .eq('topic', topic)
        .eq('preparation_mode', mode);

      if (!error && data) {
        existingQuestions = data;
      }
    } catch (e) {
      console.warn('Supabase read warning in generate route:', e);
    }

    // Check if we already have targetCount (e.g., 100) questions
    if (existingQuestions.length >= targetCount) {
      return NextResponse.json({
        count: existingQuestions.length,
        message: `Pool already has ${existingQuestions.length} questions for ${subject} -> ${mode} -> ${topic}`,
        questions: existingQuestions,
      });
    }

    const neededCount = Math.min(targetCount - existingQuestions.length, 30); // Generate up to 30 new items per batch request
    const existingStems = existingQuestions.map(q => q.question);

    // 2. Generate a batch using Gemini
    const newMCQs = await generateMCQBatch(
      subject,
      topic,
      mode as 'university' | 'usmle',
      Math.min(neededCount, 15),
      existingStems
    );

    if (newMCQs.length === 0) {
      return NextResponse.json({ count: existingQuestions.length, questions: existingQuestions });
    }

    // 3. Format and Deduplicate
    const formattedForInsert: any[] = [];
    for (const q of newMCQs) {
      if (!isDuplicateQuestion(q.question, [...existingQuestions, ...formattedForInsert])) {
        formattedForInsert.push({
          ...q,
          subject,
          topic,
          preparation_mode: mode,
          question_status: 'approved',
          source_reference: `gemini-2.0-flash_${todayDate}`,
        });
      }
    }

    // 4. Upsert into Supabase if connected
    let insertedData: any[] = [];
    if (formattedForInsert.length > 0) {
      try {
        const { data, error } = await supabase
          .from('questions')
          .upsert(formattedForInsert, { onConflict: 'question', ignoreDuplicates: true })
          .select('*');

        if (!error && data) {
          insertedData = data;
        }
      } catch (err) {
        console.warn('Supabase insert warning in generate route:', err);
      }
    }

    const allPool = [...existingQuestions, ...formattedForInsert];

    return NextResponse.json({
      count: allPool.length,
      newlyGenerated: formattedForInsert.length,
      questions: allPool,
    });
  } catch (error: any) {
    console.error('Error in questions/generate POST:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
