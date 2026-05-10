'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MediaFile } from '@/lib/types';
import { formatFileSize } from '@/lib/client-utils';

interface FileUploaderProps {
  onUploadSuccess: (files: MediaFile[]) => void;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export default function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProgress = useCallback((id: string, progress: number) => {
    setUploadingFiles(prev =>
      prev.map(uf => uf.id === id ? { ...uf, progress } : uf)
    );
  }, []);

  const updateStatus = useCallback((id: string, status: UploadingFile['status'], error?: string) => {
    setUploadingFiles(prev =>
      prev.map(uf => uf.id === id ? { ...uf, status, progress: status === 'success' ? 100 : uf.progress, error } : uf)
    );
  }, []);

  const removeUploadingFile = useCallback((id: string, delay: number = 2000) => {
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(uf => uf.id !== id));
    }, delay);
  }, []);

  const uploadFile = useCallback(async (uploadingFile: UploadingFile) => {
    const formData = new FormData();
    formData.append('files', uploadingFile.file);

    return new Promise<MediaFile>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          updateProgress(uploadingFile.id, progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            if (result.success && result.files && result.files.length > 0) {
              resolve(result.files[0]);
            } else {
              reject(new Error(result.error || '上传失败'));
            }
          } catch (e) {
            reject(new Error('解析响应失败'));
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('网络错误'));
      };

      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  }, [updateProgress]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => 
      f.type.startsWith('image/') || f.type.startsWith('video/')
    );

    if (fileArray.length === 0) return;

    const newUploadingFiles: UploadingFile[] = fileArray.map(file => ({
      id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading',
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    const uploadedFiles: MediaFile[] = [];

    for (const uf of newUploadingFiles) {
      try {
        const result = await uploadFile(uf);
        updateStatus(uf.id, 'success');
        uploadedFiles.push(result);
        removeUploadingFile(uf.id);
      } catch (error: any) {
        updateStatus(uf.id, 'error', error.message);
      }
    }

    if (uploadedFiles.length > 0) {
      onUploadSuccess(uploadedFiles);
    }
  }, [uploadFile, updateStatus, removeUploadingFile, onUploadSuccess]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-6 md:p-10 text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-cyan-400 bg-cyan-400/10'
            : 'border-slate-600 hover:border-slate-400 hover:bg-slate-800/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-base md:text-lg font-semibold text-slate-100">
              点击或拖拽文件到这里上传
            </p>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              支持 JPG, PNG, GIF, MP4, WebM 等图片和视频格式
            </p>
          </div>
        </div>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
          {uploadingFiles.map((uf) => (
            <div
              key={uf.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                uf.status === 'success'
                  ? 'bg-green-500/10 border border-green-500/30'
                  : uf.status === 'error'
                  ? 'bg-red-500/10 border border-red-500/30'
                  : 'bg-slate-800/50 border border-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center flex-shrink-0">
                {uf.file.type.startsWith('image/') ? (
                  <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{uf.file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-slate-400">{formatFileSize(uf.file.size)}</p>
                  {uf.status === 'uploading' && (
                    <span className="text-xs text-cyan-400">{uf.progress}%</span>
                  )}
                </div>
                {uf.status === 'uploading' && (
                  <div className="w-full h-1.5 bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uf.progress}%` }}
                    />
                  </div>
                )}
                {uf.status === 'error' && (
                  <p className="text-xs text-red-400 mt-1">{uf.error || '上传失败'}</p>
                )}
              </div>
              {uf.status === 'uploading' && (
                <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              )}
              {uf.status === 'success' && (
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {uf.status === 'error' && (
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
