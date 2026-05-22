'use server';

import { getQuestions, saveQuestions, Question, saveResult, QuizResult } from '@/lib/quiz-data';
import { revalidatePath } from 'next/cache';

export async function saveQuizQuestion(question: Question) {
  const questions = getQuestions();
  const existingIndex = questions.findIndex(q => q.id === question.id);
  
  if (existingIndex > -1) {
    questions[existingIndex] = question;
  } else {
    if (!question.id) question.id = Date.now().toString();
    questions.push(question);
  }

  saveQuestions(questions);
  revalidatePath('/admin/quiz');
  revalidatePath('/kuis');
  return { success: true };
}

export async function deleteQuizQuestion(id: string) {
  let questions = getQuestions();
  questions = questions.filter(q => q.id !== id);
  saveQuestions(questions);
  revalidatePath('/admin/quiz');
  revalidatePath('/kuis');
  return { success: true };
}

export async function submitQuizResult(playerName: string, score: number, totalQuestions: number) {
  const result = saveResult({ playerName, score, totalQuestions });
  revalidatePath('/admin/quiz/results');
  return result;
}
