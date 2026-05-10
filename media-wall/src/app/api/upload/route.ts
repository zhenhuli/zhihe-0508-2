import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { NextRequest } from 'next/server';
import { ensureDirs, loadMetadata, saveMetadata, getFileCategory, PUBLIC_DIR } from '@/lib/utils';
import { MediaFile } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function writeFileStream(filePath: string, file: File): Promise<void> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(filePath, buffer);
}

export async function POST(request: NextRequest) {
  try {
    ensureDirs();
    
    const formData = await request.formData();
    const fileEntries = formData.getAll('files');
    
    const uploadedFiles = loadMetadata();
    const newFiles: MediaFile[] = [];

    for (const entry of fileEntries) {
      if (!(entry instanceof File)) continue;
      
      const file = entry as File;
      if (!file.name || !file.type) continue;
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) continue;

      const id = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
      const ext = path.extname(file.name) || (file.type.startsWith('image/') ? '.jpg' : '.mp4');
      const newFileName = `${id}${ext}`;
      const newFilePath = path.join(PUBLIC_DIR, newFileName);

      await writeFileStream(newFilePath, file);

      const fileType = getFileCategory(file.type);
      const mediaFile: MediaFile = {
        id,
        name: newFileName,
        originalName: file.name,
        size: file.size || 0,
        type: fileType,
        mimeType: file.type,
        category: fileType === 'image' ? 'images' : fileType === 'video' ? 'videos' : 'other',
        uploadedAt: new Date().toISOString(),
        url: `/media/${newFileName}`,
      };

      newFiles.push(mediaFile);
    }

    const updatedFiles = [...newFiles, ...uploadedFiles];
    saveMetadata(updatedFiles);

    return NextResponse.json({
      success: true,
      message: `成功上传 ${newFiles.length} 个文件`,
      files: newFiles,
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '上传失败' },
      { status: 500 }
    );
  }
}
