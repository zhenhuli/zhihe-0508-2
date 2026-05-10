import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { loadMetadata, saveMetadata, PUBLIC_DIR } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: '请选择要删除的文件' },
        { status: 400 }
      );
    }

    const files = loadMetadata();
    const toDelete = files.filter(f => ids.includes(f.id));
    const remaining = files.filter(f => !ids.includes(f.id));

    for (const file of toDelete) {
      const filePath = path.join(PUBLIC_DIR, file.name);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Failed to delete file ${file.name}:`, err);
        }
      }
    }

    saveMetadata(remaining);

    return NextResponse.json({
      success: true,
      message: `成功删除 ${toDelete.length} 个文件`,
      deletedCount: toDelete.length,
    });

  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '删除失败' },
      { status: 500 }
    );
  }
}
