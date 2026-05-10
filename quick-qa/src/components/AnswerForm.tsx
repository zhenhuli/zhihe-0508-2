'use client';

import { useState } from 'react';
import { useUser } from '@/components/UserSelector';
import { createAnswerAction } from '@/app/actions';

interface AnswerFormProps {
  questionId: string;
  onPosted?: () => void;
}

export default function AnswerForm({ questionId, onPosted }: AnswerFormProps) {
  const { currentUser } = useUser();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setError(null);
    
    formData.set('userId', currentUser.id);
    
    try {
      const result = await createAnswerAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setShowForm(false);
        if (onPosted) {
          await onPosted();
        }
      }
    } catch (err: any) {
      setError(err.message || '发布失败');
    } finally {
      setIsPending(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full py-3 bg-slate-800/50 border border-slate-700 border-dashed rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-300 hover:border-slate-600 transition-colors font-medium"
      >
        💡 写一个回答
      </button>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <input type="hidden" name="questionId" value={questionId} />
      
      <div>
        <label htmlFor="answer-content" className="block text-sm font-medium text-slate-300 mb-1.5">
          你的回答
        </label>
        <textarea
          id="answer-content"
          name="content"
          rows={4}
          placeholder="分享你的见解..."
          required
          autoFocus
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
        />
      </div>
      
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="px-4 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl font-medium transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-wait"
        >
          {isPending ? '发布中...' : '发布回答'}
        </button>
      </div>
    </form>
  );
}
