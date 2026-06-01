import { getArticles as getDbArticles, saveArticles as saveDbArticles, initDb } from "./db";

// Initialize DB on module load
initDb().catch(console.error);

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  readTime: string;
  date: string;
  isHeadline?: boolean;
  authorInstagram?: string;
  subcategory?: string;
  tags?: string[];
  type?: 'regular' | 'scientific';
  references?: string[];
}

let dataJsonCache: Article[] | null = null;

function getDataJson(): Article[] {
  if (!dataJsonCache) {
    // @ts-ignore
    const raw = require("./data.json");
    dataJsonCache = raw.map((a: any) => ({
      ...a,
      isHeadline: a.isHeadline || false,
      tags: a.tags || [],
      type: a.type || 'regular',
      references: a.references || [],
    }));
  }
  return dataJsonCache!;
}

export async function getArticles(): Promise<Article[]> {
  try {
    const dbArticles = await getDbArticles() as any[];
    if (dbArticles && dbArticles.length > 0) return dbArticles as Article[];
  } catch (e) {
    console.warn('[data] DB query failed, falling back to data.json:', e);
  }
  return getDataJson();
}

export async function saveArticles(articles: Article[]) {
  await saveDbArticles(articles);
}
