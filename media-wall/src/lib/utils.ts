import path from 'path';
import fs from 'fs';
import { MediaFile } from './types';

export const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
export const PUBLIC_DIR = path.join(process.cwd(), 'public', 'media');
export const METADATA_FILE = path.join(UPLOADS_DIR, '.metadata.json');

export function ensureDirs() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
}

export function loadMetadata(): MediaFile[] {
  ensureDirs();
  if (!fs.existsSync(METADATA_FILE)) {
    fs.writeFileSync(METADATA_FILE, JSON.stringify([]), 'utf8');
  }
  const content = fs.readFileSync(METADATA_FILE, 'utf8');
  return JSON.parse(content || '[]');
}

export function saveMetadata(files: MediaFile[]) {
  ensureDirs();
  fs.writeFileSync(METADATA_FILE, JSON.stringify(files, null, 2), 'utf8');
}

export function getFileCategory(mimeType: string): 'image' | 'video' | 'other' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'other';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
