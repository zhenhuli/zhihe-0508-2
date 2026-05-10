'use client';

import React, { useEffect, useCallback } from 'react';
import { MediaFile } from '@/lib/types';
import { formatFileSize } from '@/lib/client-utils';

interface PreviewModalProps {
  file: MediaFile | null;
  onClose: () => void;
}

export default function PreviewModal({ file, onClose }: PreviewModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (file) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [file, handleKeyDown]);

  if (!file) return null;

  const uploadDate = new Date(file.uploadedAt);
  const dateStr = uploadDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-1 flex items-center justify-center min-h-0 rounded-xl overflow-hidden bg-slate-900">
          {file.type === 'image' ? (
            <img
              src={file.url}
              alt={file.originalName}
              className="max-w-full max-h-[70vh] object-contain"
            />
          ) : (
            <video
              src={file.url}
              controls
              autoPlay
              className="max-w-full max-h-[70vh] object-contain"
            />
          )}
        </div>

        <div className="mt-4 p-4 bg-slate-800/80 backdrop-blur rounded-xl">
          <h3 className="text-lg font-semibold text-slate-100 break-all">
            {file.originalName}
          </h3>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <span>{formatFileSize(file.size)}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                file.type === 'image'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-purple-500/20 text-purple-400'
              }`}>
                {file.type === 'image' ? '图片' : '视频'}
              </span>
              <span className="text-slate-500">{file.mimeType}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
