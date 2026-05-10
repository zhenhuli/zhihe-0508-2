'use client';

import { useState } from 'react';
import { useUser } from '@/components/UserSelector';
import { createQuestionAction } from '@/app/actions';

interface QuestionFormProps {
  onClose?: () => void;
  onPosted?: () => void;
}

export default function QuestionForm({ onClose, onPosted }: QuestionFormProps) {
  const { currentUser } = useUser();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setError(null);
    
    formData.set('userId', currentUser.id);
    
    try {
      const result = await createQuestionAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        if (onClose) onClose();
        if (onPosted) await onPosted();
      }
    } catch (err: any) {
      setError(err.message || '发布失败');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1.5">
          问题标题 <span className="text-rose-400">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="输入你的问题..."
          required
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-1.5">
          问题详情 <span className="text-rose-400">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          rows={5}
          placeholder="详细描述你的问题..."
          required
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
        />
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-slate-300 mb-1.5">
          标签 <span className="text-slate-500 font-normal">(用逗号分隔)</span>
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          placeholder="例如: nextjs, react, typescript"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
        />
      </div>
      
      <div className="flex gap-3 pt-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl font-medium transition-colors"
          >
            取消
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-wait"
        >
          {isPending ? '发布中...' : '发布问题'}
        </button>
      </div>
    </form>
  );
}
