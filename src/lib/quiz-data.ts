import fs from 'fs';
import path from 'path';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  category?: string;
}

export interface QuizResult {
  id: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  date: string;
}

interface QuizDatabase {
  questions: Question[];
  results: QuizResult[];
}

const dbPath = path.join(process.cwd(), 'src', 'lib', 'quiz-data.json');

function getDb(): QuizDatabase {
  if (!fs.existsSync(dbPath)) {
    return { questions: [], results: [] };
  }
  const fileContent = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(fileContent);
}

function saveDb(data: QuizDatabase) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function getQuestions(): Question[] {
  return getDb().questions;
}

export function saveQuestions(questions: Question[]) {
  const db = getDb();
  db.questions = questions;
  saveDb(db);
}

export function getResults(): QuizResult[] {
  return getDb().results;
}

export function saveResult(result: Omit<QuizResult, 'id' | 'date'>) {
  const db = getDb();
  const newResult: QuizResult = {
    ...result,
    id: Date.now().toString(),
    date: new Date().toLocaleString('id-ID', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    })
  };
  db.results.push(newResult);
  saveDb(db);
  return newResult;
}
