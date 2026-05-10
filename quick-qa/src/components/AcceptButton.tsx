'use client';

import { useState } from 'react';
import { useUser } from '@/components/UserSelector';
import { acceptAnswerAction } from '@/app/actions';

interface AcceptButtonProps {
  questionId: string;
  answerId: string;
  initialAccepted: boolean;
}

export default function AcceptButton({ questionId, answerId, initialAccepted }: AcceptButtonProps) {
  const { currentUser } = useUser();
  const [isAccepted, setIsAccepted] = useState(initialAccepted);
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      const result = await acceptAnswerAction(questionId, answerId, currentUser.id);
      if (result) {
        setIsAccepted(result.isAccepted);
      }
    } catch (error) {
      console.error('Failed to accept answer:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
        isAccepted
          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-emerald-400 hover:border-emerald-500/30 border border-transparent'
      } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
    >
      <svg
        className="w-4 h-4"
        fill={isAccepted ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
        />
      </svg>
      <span className="text-sm font-medium">{isAccepted ? '已采纳' : '采纳回答'}</span>
    </button>
  );
}
