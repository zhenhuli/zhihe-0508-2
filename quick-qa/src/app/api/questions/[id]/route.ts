import { NextResponse } from 'next/server';
import { getQuestionById } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-1';
    const question = await getQuestionById(params.id, userId);
    if (!question) {
      return NextResponse.json(
        { success: false, error: '问题不存在' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, question });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || '获取问题详情失败' },
      { status: 500 }
    );
  }
}
