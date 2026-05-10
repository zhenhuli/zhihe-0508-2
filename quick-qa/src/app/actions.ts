'use server';

import { revalidatePath } from 'next/cache';
import { createQuestion, createAnswer, toggleQuestionLike, toggleQuestionFavorite, toggleAnswerLike, acceptAnswer } from '@/lib/store';

export async function createQuestionAction(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const tagsRaw = formData.get('tags') as string;
  const userId = (formData.get('userId') as string) || 'user-1';
  
  if (!title?.trim() || !content?.trim()) {
    return { error: '标题和内容不能为空' };
  }
  
  const tags = tagsRaw
    ? tagsRaw.split(',').map(t => t.trim()).filter(t => t)
    : [];
  
  await createQuestion({ title: title.trim(), content: content.trim(), tags }, userId);
  revalidatePath('/');
  return { success: true };
}

export async function createAnswerAction(formData: FormData) {
  const questionId = formData.get('questionId') as string;
  const content = formData.get('content') as string;
  const userId = (formData.get('userId') as string) || 'user-1';
  
  if (!questionId || !content?.trim()) {
    return { error: '回答内容不能为空' };
  }
  
  await createAnswer(questionId, content.trim(), userId);
  revalidatePath(`/question/${questionId}`);
  return { success: true };
}

export async function toggleQuestionLikeAction(questionId: string, userId: string) {
  const result = await toggleQuestionLike(questionId, userId);
  revalidatePath('/');
  revalidatePath(`/question/${questionId}`);
  return result;
}

export async function toggleQuestionFavoriteAction(questionId: string, userId: string) {
  const result = await toggleQuestionFavorite(questionId, userId);
  revalidatePath('/');
  revalidatePath(`/question/${questionId}`);
  return result;
}

export async function toggleAnswerLikeAction(questionId: string, answerId: string, userId: string) {
  const result = await toggleAnswerLike(questionId, answerId, userId);
  revalidatePath(`/question/${questionId}`);
  return result;
}

export async function acceptAnswerAction(questionId: string, answerId: string, userId: string) {
  const result = await acceptAnswer(questionId, answerId, userId);
  revalidatePath(`/question/${questionId}`);
  return result;
}
