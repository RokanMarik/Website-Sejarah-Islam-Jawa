import { createClient, Client } from "@libsql/client";

const dbUrl = process.env.DATABASE_URL || "file:local.db";

let db: Client | null = null;

// In-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  if (entry) {
    cache.delete(key);
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(pattern?: string): void {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

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
      tags TEXT,
      type TEXT DEFAULT 'regular',
      references TEXT
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
  const cached = getCached('articles:all');
  if (cached) return cached;

  const database = getDb();
  const result = await database.execute("SELECT * FROM articles ORDER BY date DESC");
  const articles = result.rows.map(row => ({
    ...row,
    isHeadline: (row as any).isHeadline === 1,
    tags: (row as any).tags ? JSON.parse((row as any).tags as string) : [],
    type: (row as any).type || 'regular',
    references: (row as any).references ? JSON.parse((row as any).references as string) : [],
  }));

  setCache('articles:all', articles);
  return articles;
}

export async function saveArticles(articles: any[]) {
  const database = getDb();
  
  const statements = articles.map(article => ({
    sql: `INSERT OR REPLACE INTO articles 
      (id, slug, title, excerpt, content, coverImage, category, author, readTime, date, isHeadline, authorInstagram, subcategory, tags, type, references)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      article.type || 'regular',
      JSON.stringify(article.references || []),
    ],
  }));

  await database.batch(statements);
}

export async function getArticleBySlug(slug: string) {
  const cacheKey = `article:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const database = getDb();
  const result = await database.execute({
    sql: "SELECT * FROM articles WHERE slug = ?",
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  const article = {
    ...row,
    isHeadline: (row as any).isHeadline === 1,
    tags: (row as any).tags ? JSON.parse((row as any).tags as string) : [],
    type: (row as any).type || 'regular',
    references: (row as any).references ? JSON.parse((row as any).references as string) : [],
  };

  setCache(cacheKey, article);
  return article;
}
