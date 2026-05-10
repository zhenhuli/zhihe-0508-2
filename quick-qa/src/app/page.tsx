'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/lib/types';
import { useUser } from '@/components/UserSelector';
import QuestionCard from '@/components/QuestionCard';
import QuestionModal from '@/components/QuestionModal';

export default function HomePage() {
  const { currentUser } = useUser();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/questions?userId=${currentUser.id}`);
      const result = await response.json();
      if (result.success) {
        setQuestions(result.questions);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [currentUser.id]);

  const handleQuestionCreated = () => {
    loadQuestions();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">最新问题</h2>
          <p className="text-slate-400 mt-1">发现和分享知识</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          发布问题
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="mt-4 text-slate-400">加载中...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-slate-300 mb-2 text-lg">暂无问题</p>
          <p className="text-slate-500 text-sm">点击上方按钮发布第一个问题</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}

      <QuestionModal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        handleQuestionCreated();
      }} />
    </div>
  );
}
