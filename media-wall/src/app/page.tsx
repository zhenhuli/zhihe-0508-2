'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MediaFile, Category } from '@/lib/types';
import FileUploader from '@/components/FileUploader';
import MediaCard from '@/components/MediaCard';
import PreviewModal from '@/components/PreviewModal';
import CategoryFilter from '@/components/CategoryFilter';

export default function Home() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [allFiles, setAllFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category>('all');
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async (category: Category = 'all') => {
    try {
      setLoading(true);
      const response = await fetch(`/api/files?category=${category}`);
      const result = await response.json();
      if (result.success) {
        setFiles(result.files);
        if (category === 'all') {
          setAllFiles(result.files);
        }
      } else {
        setError(result.error || '获取文件列表失败');
      }
    } catch (err: any) {
      setError(err.message || '获取文件列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles(currentCategory);
  }, [currentCategory, fetchFiles]);

  const handleUploadSuccess = (newFiles: MediaFile[]) => {
    setFiles(prev => [...newFiles, ...prev]);
    setAllFiles(prev => [...newFiles, ...prev]);
    if (currentCategory !== 'all') {
      const filtered = newFiles.filter(f => 
        currentCategory === 'images' ? f.type === 'image' : f.type === 'video'
      );
      if (filtered.length > 0) {
        setFiles(prev => [...filtered, ...prev]);
      }
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      return [...prev, id];
    });
  };

  const handleSelectAll = () => {
    const visibleFileIds = files.map(f => f.id);
    if (selectedIds.length === visibleFileIds.length && visibleFileIds.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleFileIds);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmMessage = selectedIds.length === 1
      ? '确定要删除这个文件吗？'
      : `确定要删除选中的 ${selectedIds.length} 个文件吗？`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const result = await response.json();
      if (result.success) {
        setFiles(prev => prev.filter(f => !selectedIds.includes(f.id)));
        setAllFiles(prev => prev.filter(f => !selectedIds.includes(f.id)));
        setSelectedIds([]);
      } else {
        alert(result.error || '删除失败');
      }
    } catch (err: any) {
      alert(err.message || '删除失败');
    }
  };

  const allImages = allFiles.filter(f => f.type === 'image').length;
  const allVideos = allFiles.filter(f => f.type === 'video').length;
  const hasAnyFiles = allFiles.length > 0;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Media Wall</h1>
                <p className="text-xs sm:text-sm text-slate-400">图片视频墙 · 支持多文件上传与分类管理</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <FileUploader onUploadSuccess={handleUploadSuccess} />

        {hasAnyFiles && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 mt-6">
            <CategoryFilter
              currentCategory={currentCategory}
              onChange={setCurrentCategory}
              counts={{ all: allFiles.length, images: allImages, videos: allVideos }}
            />

            {files.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700 transition-colors text-sm"
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      selectedIds.length === files.length && files.length > 0
                        ? 'bg-cyan-500 border-cyan-500'
                        : 'border-slate-500'
                    }`}
                  >
                    {selectedIds.length === files.length && files.length > 0 && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span>{selectedIds.length === files.length && files.length > 0 ? '取消全选' : '全选'}</span>
                </button>

                {selectedIds.length > 0 && (
                  <>
                    <span className="text-sm text-slate-400">
                      已选择 {selectedIds.length} 项
                    </span>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>删除</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <p className="mt-4 text-slate-400">加载中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-slate-300 mb-2">加载出错</p>
            <p className="text-slate-500 text-sm">{error}</p>
            <button
              onClick={() => fetchFiles(currentCategory)}
              className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              重试
            </button>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-300 mb-2 text-lg">
              {hasAnyFiles 
                ? (currentCategory === 'images' ? '暂无图片' : currentCategory === 'videos' ? '暂无视频' : '暂无媒体文件')
                : '暂无媒体文件'
              }
            </p>
            <p className="text-slate-500 text-sm">
              {hasAnyFiles 
                ? '切换到其他分类查看更多文件'
                : '使用上方拖拽上传区域添加文件'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {files.map((file) => (
              <MediaCard
                key={file.id}
                file={file}
                isSelected={selectedIds.includes(file.id)}
                onSelect={handleSelect}
                onPreview={setPreviewFile}
              />
            ))}
          </div>
        )}
      </main>

      <PreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
