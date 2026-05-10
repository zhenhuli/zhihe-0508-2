import { Answer } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import LikeButton from './LikeButton';
import AcceptButton from './AcceptButton';

interface AnswerCardProps {
  questionId: string;
  answer: Answer;
  isQuestionAuthor: boolean;
}

export default function AnswerCard({ questionId, answer, isQuestionAuthor }: AnswerCardProps) {
  const canAccept = isQuestionAuthor && !answer.isMine;

  return (
    <article className={`bg-slate-800/30 border rounded-xl p-4 sm:p-5 ${
      answer.isAccepted 
        ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' 
        : 'border-slate-700/50'
    }`}>
      {answer.isAccepted && (
        <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg w-fit">
          <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
          <span className="text-emerald-400 text-sm font-medium">已采纳</span>
        </div>
      )}
      
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg">
          {answer.author.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-slate-200">{answer.author.name}</span>
            {answer.isMine && (
              <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs font-medium rounded-full">
                我
              </span>
            )}
            <span className="text-slate-500 text-sm">· {formatDate(answer.createdAt)}</span>
          </div>
        </div>
      </div>
      
      <div className="text-slate-300 whitespace-pre-wrap mb-4">
        {answer.content}
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <LikeButton
          questionId={questionId}
          answerId={answer.id}
          initialCount={answer.likeCount}
          initialLiked={answer.isLiked}
        />
        {canAccept && (
          <AcceptButton
            questionId={questionId}
            answerId={answer.id}
            initialAccepted={answer.isAccepted}
          />
        )}
      </div>
    </article>
  );
}
