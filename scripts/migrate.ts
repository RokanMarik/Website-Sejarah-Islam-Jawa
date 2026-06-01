import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import Database from "better-sqlite3";

const dataPath = path.join(process.cwd(), "src", "lib", "data.json");
const dbDir = path.join(process.cwd(), "data");
const dbPath = path.join(dbDir, "nusahistoria.db");

// Ensure data directory exists
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// Remove existing database (create fresh from JSON)
if (existsSync(dbPath)) {
  const backupPath = dbPath + ".backup";
  writeFileSync(backupPath, readFileSync(dbPath));
  console.log(`Backed up existing database to ${backupPath}`);
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

// Create table
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

// Read JSON data
const data = JSON.parse(readFileSync(dataPath, "utf8"));

// Insert data
const stmt = db.prepare(`
  INSERT OR REPLACE INTO articles 
  (id, slug, title, excerpt, content, coverImage, category, author, readTime, date, isHeadline, authorInstagram, subcategory, tags)
  VALUES (@id, @slug, @title, @excerpt, @content, @coverImage, @category, @author, @readTime, @date, @isHeadline, @authorInstagram, @subcategory, @tags)
`);

const insertMany = db.transaction((articles: any[]) => {
  for (const article of articles) {
    stmt.run({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content || '',
      coverImage: article.coverImage || '',
      category: article.category || '',
      author: article.author || '',
      readTime: article.readTime || '',
      date: article.date || '',
      isHeadline: article.isHeadline ? 1 : 0,
      authorInstagram: article.authorInstagram || '',
      subcategory: article.subcategory || '',
      tags: JSON.stringify(article.tags || []),
    });
  }
});

insertMany(data);

const count = db.prepare("SELECT COUNT(*) as count FROM articles").get() as { count: number };
console.log(`Migrated ${count.count} articles to SQLite`);

db.close();
