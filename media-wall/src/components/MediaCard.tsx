'use client';

import React from 'react';
import { MediaFile } from '@/lib/types';
import { formatFileSize } from '@/lib/client-utils';

interface MediaCardProps {
  file: MediaFile;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onPreview: (file: MediaFile) => void;
}

export default function MediaCard({ file, isSelected, onSelect, onPreview }: MediaCardProps) {
  const uploadDate = new Date(file.uploadedAt);
  const dateStr = uploadDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      className={`group relative rounded-xl overflow-hidden bg-slate-800/50 border transition-all duration-200 ${
        isSelected
          ? 'border-cyan-400 shadow-lg shadow-cyan-400/20'
          : 'border-slate-700 hover:border-slate-500'
      }`}
    >
      <div
        className="relative aspect-square cursor-pointer"
        onClick={() => onPreview(file)}
      >
        {file.type === 'image' ? (
          <img
            src={file.url}
            alt={file.originalName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="relative w-full h-full">
            <video
              src={file.url}
              className="w-full h-full object-cover"
              preload="metadata"
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 rounded text-xs text-white">
              视频
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
      </div>

      <div
        className="absolute top-2 left-2 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(file.id);
        }}
      >
        <div
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-cyan-500 border-cyan-500'
              : 'bg-black/40 border-white/40 group-hover:border-white/70'
          }`}
        >
          {isSelected && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-slate-100 truncate" title={file.originalName}>
          {file.originalName}
        </p>
        <div className="flex items-center justify-between mt-1.5 text-xs text-slate-400">
          <span>{formatFileSize(file.size)}</span>
          <span>{dateStr}</span>
        </div>
      </div>
    </div>
  );
}
