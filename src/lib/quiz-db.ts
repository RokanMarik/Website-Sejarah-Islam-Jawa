import { getDb } from "./db";

export interface QuizResult {
  id?: number;
  playerName: string;
  score: number;
  totalQuestions: number;
  category: string;
  rating?: string;
  createdAt?: string;
}

export async function saveQuizResult(result: QuizResult): Promise<QuizResult> {
  const database = getDb();
  const res = await database.execute({
    sql: `INSERT INTO quiz_results (playerName, score, totalQuestions, category, rating) VALUES (?, ?, ?, ?, ?)`,
    args: [result.playerName, result.score, result.totalQuestions, result.category, result.rating || ''],
  });

  return { ...result, id: res.lastInsertRowid as unknown as number };
}

export async function getQuizResults(limit = 50): Promise<QuizResult[]> {
  const database = getDb();
  const res = await database.execute({
    sql: "SELECT * FROM quiz_results ORDER BY score DESC, createdAt DESC LIMIT ?",
    args: [limit],
  });
  return res.rows as unknown as QuizResult[];
}

export async function getPlayerResults(playerName: string): Promise<QuizResult[]> {
  const database = getDb();
  const res = await database.execute({
    sql: "SELECT * FROM quiz_results WHERE playerName = ? ORDER BY createdAt DESC",
    args: [playerName],
  });
  return res.rows as unknown as QuizResult[];
}
