'use client';

import { useState } from 'react';
import { useUser } from '@/components/UserSelector';
import { toggleQuestionLikeAction, toggleAnswerLikeAction } from '@/app/actions';

interface LikeButtonProps {
  questionId: string;
  answerId?: string;
  initialCount: number;
  initialLiked: boolean;
}

export default function LikeButton({ questionId, answerId, initialCount, initialLiked }: LikeButtonProps) {
  const { currentUser } = useUser();
  const [count, setCount] = useState(initialCount);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    if (isPending) return;
    setIsPending(true);
    
    const optimisticLiked = !isLiked;
    const optimisticCount = optimisticLiked ? count + 1 : count - 1;
    setIsLiked(optimisticLiked);
    setCount(optimisticCount);

    try {
      if (answerId) {
        await toggleAnswerLikeAction(questionId, answerId, currentUser.id);
      } else {
        await toggleQuestionLikeAction(questionId, currentUser.id);
      }
    } catch {
      setIsLiked(isLiked);
      setCount(count);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
        isLiked
          ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
    >
      <svg
        className={`w-4 h-4 transition-transform ${isLiked ? 'scale-110' : ''}`}
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="text-sm font-medium">{count}</span>
    </button>
  );
}
