'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { QuestionWithAnswers } from '@/lib/types';
import { useUser } from '@/components/UserSelector';
import { formatDate } from '@/lib/utils';
import LikeButton from '@/components/LikeButton';
import FavoriteButton from '@/components/FavoriteButton';
import AnswerCard from '@/components/AnswerCard';
import AnswerForm from '@/components/AnswerForm';

interface QuestionPageProps {
  params: { id: string };
}

export default function QuestionPage({ params }: QuestionPageProps) {
  const { currentUser } = useUser();
  const [question, setQuestion] = useState<QuestionWithAnswers | null>(null);
  const [loading, setLoading] = useState(true);

  const loadQuestion = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/questions/${params.id}?userId=${currentUser.id}`);
      const result = await response.json();
      if (result.success) {
        setQuestion(result.question);
      }
    } catch (err) {
      console.error('Failed to load question:', err);
    } finally {
      setLoading(false);
    }
  }, [params.id, currentUser.id]);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        <p className="mt-4 text-slate-400">加载中...</p>
      </div>
    );
  }

  if (!question) {
    notFound();
  }

  const sortedAnswers = [...question.answers].sort((a, b) => {
    if (a.isAccepted && !b.isAccepted) return -1;
    if (!a.isAccepted && b.isAccepted) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回列表
      </Link>

      <article className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl">
            {question.author.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-slate-200">{question.author.name}</span>
              {question.isMine && (
                <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs font-medium rounded-full">
                  我
                </span>
              )}
              <span className="text-slate-500 text-sm">· {formatDate(question.createdAt)}</span>
            </div>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">
          {question.title}
        </h1>

        {question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-medium bg-violet-500/10 text-violet-400 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-slate-300 whitespace-pre-wrap mb-6">
          {question.content}
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
          <LikeButton
            questionId={question.id}
            initialCount={question.likeCount}
            initialLiked={question.isLiked}
          />
          <FavoriteButton
            questionId={question.id}
            initialFavorited={question.isFavorited}
          />
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-medium">{question.answerCount} 个回答</span>
          </div>
        </div>
      </article>

      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white">回答</h2>
        
        <AnswerForm questionId={question.id} onPosted={loadQuestion} />

        {sortedAnswers.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-slate-400">还没有回答，成为第一个回答者吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAnswers.map((answer) => (
              <AnswerCard
                key={answer.id}
                questionId={question.id}
                answer={answer}
                isQuestionAuthor={question.isMine}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
