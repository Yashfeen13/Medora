import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DailyStats, OverallStats, SubjectStats } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];
    const defaultStats: OverallStats = {
      totalAttempts: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      overallAccuracy: 0,
      currentStreak: 0,
      todayStats: {
        date: today,
        total: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0,
      },
      subjectStats: [],
    };

    try {
      const supabase = createServerSupabaseClient();
      
      const { data: attempts, error } = await supabase
        .from('user_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('attempted_at', { ascending: true });

      if (error || !attempts) {
        console.warn('Progress GET warning:', error?.message);
        return NextResponse.json({ stats: defaultStats, today: defaultStats.todayStats, overall: { total: 0, accuracy: 0, streak: 0 }, subjects: [] });
      }

      // Base variables
      const totalAttempts = attempts.length;
      const totalCorrect = attempts.filter(a => a.is_correct).length;
      const totalIncorrect = totalAttempts - totalCorrect;
      const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

      // Today stats
      const todayAttempts = attempts.filter(a => {
        const dateStr = String(a.attempted_at).split('T')[0];
        return dateStr === today;
      });
      const todayTotal = todayAttempts.length;
      const todayCorrect = todayAttempts.filter(a => a.is_correct).length;
      const todayIncorrect = todayTotal - todayCorrect;
      const todayAccuracy = todayTotal > 0 ? Math.round((todayCorrect / todayTotal) * 100) : 0;

      const todayStats: DailyStats = {
        date: today,
        total: todayTotal,
        correct: todayCorrect,
        incorrect: todayIncorrect,
        accuracy: todayAccuracy,
      };

      // Subject stats
      const subjectMap = new Map<string, { total: number, correct: number }>();
      attempts.forEach(a => {
        const current = subjectMap.get(a.subject) || { total: 0, correct: 0 };
        subjectMap.set(a.subject, {
          total: current.total + 1,
          correct: current.correct + (a.is_correct ? 1 : 0),
        });
      });

      const subjectStats: SubjectStats[] = Array.from(subjectMap.entries()).map(([subject, stats]) => ({
        subject,
        total: stats.total,
        correct: stats.correct,
        accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      }));

      // Streak Calculation
      let currentStreak = 0;
      const uniqueDates = Array.from(new Set(attempts.map(a => String(a.attempted_at).split('T')[0]))).sort().reverse();
      
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toISOString().split('T')[0];

      if (uniqueDates.length > 0 && (uniqueDates[0] === today || uniqueDates[0] === yesterday)) {
        currentStreak = 1;
        let checkDate = new Date(uniqueDates[0]);
        
        for (let i = 1; i < uniqueDates.length; i++) {
          checkDate.setDate(checkDate.getDate() - 1);
          const expectedDateStr = checkDate.toISOString().split('T')[0];
          if (uniqueDates[i] === expectedDateStr) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      const overallStats: OverallStats = {
        totalAttempts,
        totalCorrect,
        totalIncorrect,
        overallAccuracy,
        currentStreak,
        todayStats,
        subjectStats,
      };

      return NextResponse.json({
        stats: overallStats,
        today: todayStats,
        overall: {
          total: totalAttempts,
          accuracy: overallAccuracy,
          streak: currentStreak,
        },
        subjects: subjectStats,
      });
    } catch (dbError) {
      console.warn('Progress DB Exception:', dbError);
      return NextResponse.json({ stats: defaultStats, today: defaultStats.todayStats, overall: { total: 0, accuracy: 0, streak: 0 }, subjects: [] });
    }
  } catch (error: any) {
    console.error('Error in progress GET:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
