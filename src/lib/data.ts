import fs from 'fs';
import path from 'path';

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

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.json');

export function getArticles(): Article[] {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading data file:', error);
    return [];
  }
}

export function saveArticles(articles: Article[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(articles, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving data file:', error);
    throw new Error('Failed to save data');
  }
}
