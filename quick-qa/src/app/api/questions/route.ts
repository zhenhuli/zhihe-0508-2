import { NextResponse } from 'next/server';
import { getQuestions } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-1';
    const questions = await getQuestions(userId);
    return NextResponse.json({ success: true, questions });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || '获取问题列表失败' },
      { status: 500 }
    );
  }
}
