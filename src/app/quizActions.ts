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

export async function submitQuizResult(playerName: string, score: number, totalQuestions: number, category: string = "Campuran", rating: string = "") {
  // Save to Google Sheets
  try {
    const googleAppScriptURL = "https://script.google.com/macros/s/AKfycbyz1mtpoCPvXexUEMJqC6fJJhqSYpNoNAZ1wBtMQVRcRfwJCV5K0NPSjFN1KwCVTZ804w/exec";
    
    await fetch(googleAppScriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: playerName,
        category: category || "Campuran",
        score: score,
        totalQuestions: totalQuestions,
        rating: rating
      })
    });
  } catch (error) {
    console.error("Failed to save to Google Sheets:", error);
  }

  // Save locally (will work on localhost, but will fail gracefully on Vercel due to read-only filesystem)
  let result = null;
  try {
    result = saveResult({ playerName, score, totalQuestions });
    revalidatePath('/admin/quiz/results');
  } catch (e) {
    console.log("Local save failed (expected on Vercel):", e);
  }
  
  return result || { success: true };
}
