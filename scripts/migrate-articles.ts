import { createClient } from "@libsql/client";
import articlesData from "../src/lib/data.json";

const db = createClient({ url: "file:local.db" });

async function migrate() {
  console.log("Creating tables...");
  await db.execute(`
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

  const articles = Array.isArray(articlesData) ? articlesData : [];
  console.log(`Migrating ${articles.length} articles...`);

  const statements = articles.map(a => ({
    sql: `INSERT OR REPLACE INTO articles 
      (id, slug, title, excerpt, content, coverImage, category, author, readTime, date, isHeadline, authorInstagram, subcategory, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      a.id,
      a.slug,
      a.title,
      a.excerpt || "",
      a.content || "",
      a.coverImage || "",
      a.category || "",
      a.author || "",
      a.readTime || "",
      a.date || "",
      a.isHeadline ? 1 : 0,
      a.authorInstagram || "",
      a.subcategory || "",
      JSON.stringify(a.tags || []),
    ],
  }));

  await db.batch(statements);
  console.log("✅ Migration complete!");
}

migrate().catch(err => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
