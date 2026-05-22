'use server';

import { getArticles, saveArticles, Article } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

export async function saveArticle(data: Article) {
  const articles = getArticles();
  const existingIndex = articles.findIndex(a => a.id === data.id);
  
  if (existingIndex > -1) {
    articles[existingIndex] = data;
  } else {
    // New article
    data.id = Date.now().toString();
    articles.push(data);
  }

  saveArticles(articles);
  
  // Revalidate homepage and article page to show new content immediately
  revalidatePath('/');
  revalidatePath(`/article/${data.slug}`);
  revalidatePath('/admin');
  
  return { success: true };
}

export async function deleteArticle(id: string) {
  let articles = getArticles();
  articles = articles.filter(a => a.id !== id);
  saveArticles(articles);
  
  revalidatePath('/');
  revalidatePath('/admin');
  
  return { success: true };
}

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file uploaded');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `${uniquePrefix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  
  // Save to public/uploads directory
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, buffer);

  // Return the public URL
  return { url: `/uploads/${filename}` };
}
