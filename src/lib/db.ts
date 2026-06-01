import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "nusahistoria.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    
    db.exec(`
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
      );
    `);
  }
  return db;
}

export function getArticles() {
  const database = getDb();
  const rows = database.prepare("SELECT * FROM articles ORDER BY date DESC").all() as any[];
  return rows.map(row => ({
    ...row,
    isHeadline: row.isHeadline === 1,
    tags: row.tags ? JSON.parse(row.tags) : [],
  }));
}

export function saveArticles(articles: any[]) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO articles 
    (id, slug, title, excerpt, content, coverImage, category, author, readTime, date, isHeadline, authorInstagram, subcategory, tags)
    VALUES (@id, @slug, @title, @excerpt, @content, @coverImage, @category, @author, @readTime, @date, @isHeadline, @authorInstagram, @subcategory, @tags)
  `);

  const insertMany = database.transaction((articles) => {
    for (const article of articles) {
      stmt.run({
        ...article,
        isHeadline: article.isHeadline ? 1 : 0,
        tags: JSON.stringify(article.tags || []),
      });
    }
  });

  insertMany(articles);
}
