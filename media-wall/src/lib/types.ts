export interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: 'image' | 'video' | 'other';
  mimeType: string;
  category: string;
  uploadedAt: string;
  url: string;
}

export type Category = 'all' | 'images' | 'videos';
