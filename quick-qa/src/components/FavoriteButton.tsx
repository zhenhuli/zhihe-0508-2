'use client';

import { useState } from 'react';
import { useUser } from '@/components/UserSelector';
import { toggleQuestionFavoriteAction } from '@/app/actions';

interface FavoriteButtonProps {
  questionId: string;
  initialFavorited: boolean;
}

export default function FavoriteButton({ questionId, initialFavorited }: FavoriteButtonProps) {
  const { currentUser } = useUser();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    if (isPending) return;
    setIsPending(true);
    
    const optimisticFavorited = !isFavorited;
    setIsFavorited(optimisticFavorited);

    try {
      await toggleQuestionFavoriteAction(questionId, currentUser.id);
    } catch {
      setIsFavorited(isFavorited);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
        isFavorited
          ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
    >
      <svg
        className="w-4 h-4"
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
      <span className="text-sm font-medium">{isFavorited ? '已收藏' : '收藏'}</span>
    </button>
  );
}
