import { getArticles as getDbArticles, saveArticles as saveDbArticles } from "./db";

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

export function getArticles(): Article[] {
  return getDbArticles() as Article[];
}

export function saveArticles(articles: Article[]) {
  saveDbArticles(articles);
}
