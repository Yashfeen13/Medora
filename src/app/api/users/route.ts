import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { id, name } = await request.json();
    if (!id || !name) {
      return NextResponse.json({ error: 'Missing id or name' }, { status: 400 });
    }

    try {
      const supabase = createServerSupabaseClient();
      
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id,
          name,
          last_active_at: new Date().toISOString(),
        }, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.warn('User upsert warning:', error.message);
      }
      
      return NextResponse.json({ user: data || { id, name } });
    } catch (dbError) {
      console.warn('DB error on user POST:', dbError);
      return NextResponse.json({ user: { id, name } });
    }
  } catch (error: any) {
    console.error('Error in users POST:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('User GET warning:', error.message);
        return NextResponse.json({ user: { id: userId, name: 'Student' } });
      }
      
      return NextResponse.json({ user: data });
    } catch (dbError) {
      console.warn('DB error on user GET:', dbError);
      return NextResponse.json({ user: { id: userId, name: 'Student' } });
    }
  } catch (error: any) {
    console.error('Error in users GET:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
