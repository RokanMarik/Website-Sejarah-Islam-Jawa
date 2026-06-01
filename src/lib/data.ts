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
}

export async function getArticles(): Promise<Article[]> {
  return (await getDbArticles()) as unknown as Article[];
}

export async function saveArticles(articles: Article[]) {
  await saveDbArticles(articles);
}
