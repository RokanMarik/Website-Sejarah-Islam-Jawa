import { createClient, Client } from "@libsql/client";
import path from "path";

const dbUrl = process.env.DATABASE_URL || "file:local.db";

let db: Client | null = null;

export function getDb(): Client {
  if (!db) {
    db = createClient({ url: dbUrl });
  }
  return db;
}

export async function initDb() {
  const database = getDb();
  await database.execute(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      coverImage TEXT,
      category TEXT,
      author TEXT,
      readTime TEXT,
      date TEXT,
      isHeadline INTEGER DEFAULT 0,
      authorInstagram TEXT,
      subcategory TEXT,
      tags TEXT
    )
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      playerName TEXT NOT NULL,
      score INTEGER NOT NULL,
      totalQuestions INTEGER NOT NULL,
      category TEXT DEFAULT 'Campuran',
      rating TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS dictionary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      term TEXT UNIQUE NOT NULL,
      definition TEXT NOT NULL
    )
  `);
}

export async function getArticles() {
  const database = getDb();
  const result = await database.execute("SELECT * FROM articles ORDER BY date DESC");
  return result.rows.map(row => ({
    ...row,
    isHeadline: (row as any).isHeadline === 1,
    tags: (row as any).tags ? JSON.parse((row as any).tags as string) : [],
  }));
}

export async function saveArticles(articles: any[]) {
  const database = getDb();
  
  await database.transaction(async (tx) => {
    for (const article of articles) {
      await tx.execute({
        sql: `INSERT OR REPLACE INTO articles 
          (id, slug, title, excerpt, content, coverImage, category, author, readTime, date, isHeadline, authorInstagram, subcategory, tags)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          article.id,
          article.slug,
          article.title,
          article.excerpt || '',
          article.content || '',
          article.coverImage || '',
          article.category || '',
          article.author || '',
          article.readTime || '',
          article.date || '',
          article.isHeadline ? 1 : 0,
          article.authorInstagram || '',
          article.subcategory || '',
          JSON.stringify(article.tags || []),
        ],
      });
    }
  });
}

export async function getArticleBySlug(slug: string) {
  const database = getDb();
  const result = await database.execute({
    sql: "SELECT * FROM articles WHERE slug = ?",
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    ...row,
    isHeadline: (row as any).isHeadline === 1,
    tags: (row as any).tags ? JSON.parse((row as any).tags as string) : [],
  };
}
