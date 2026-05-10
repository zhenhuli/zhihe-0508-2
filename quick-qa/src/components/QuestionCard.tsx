import Link from 'next/link';
import { Question } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import LikeButton from './LikeButton';
import FavoriteButton from './FavoriteButton';

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <article className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600/50 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg">
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
      
      <Link href={`/question/${question.id}`} className="block group">
        <h2 className="text-lg sm:text-xl font-semibold text-white group-hover:text-violet-400 transition-colors mb-2 line-clamp-2">
          {question.title}
        </h2>
      </Link>
      
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
        {question.content}
      </p>
      
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
      
      <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
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
        <Link
          href={`/question/${question.id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-sm font-medium">{question.answerCount}</span>
        </Link>
      </div>
    </article>
  );
}
