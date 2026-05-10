import { NextResponse } from 'next/server';
import { loadMetadata } from '@/lib/utils';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    
    let files = loadMetadata();

    if (category === 'images') {
      files = files.filter(f => f.type === 'image');
    } else if (category === 'videos') {
      files = files.filter(f => f.type === 'video');
    }

    files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json({
      success: true,
      files,
    });
  } catch (error: any) {
    console.error('Get files error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '获取文件列表失败' },
      { status: 500 }
    );
  }
}
