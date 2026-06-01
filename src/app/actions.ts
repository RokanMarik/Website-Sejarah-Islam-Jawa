'use server';

import { getArticles, saveArticles, Article } from '@/lib/data';
import { invalidateCache } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { headers } from 'next/headers';
import { validateCsrfToken } from '@/lib/csrf';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function requireCsrf() {
  const headersList = await headers();
  const csrfHeader = headersList.get('x-csrf-token');
  const valid = await validateCsrfToken(csrfHeader || '');
  if (!valid) {
    throw new Error('CSRF validation failed');
  }
}

export async function saveArticle(data: Article) {
  await requireCsrf();
  const articles = await getArticles();
  const existingIndex = articles.findIndex(a => a.id === data.id);
  
  if (existingIndex > -1) {
    articles[existingIndex] = data;
  } else {
    data.id = Date.now().toString();
    articles.push(data);
  }

  await saveArticles(articles);
  
  invalidateCache();
  
  revalidatePath('/');
  revalidatePath(`/article/${data.slug}`);
  revalidatePath('/admin');
  
  return { success: true };
}

export async function deleteArticle(id: string) {
  await requireCsrf();
  let articles = await getArticles();
  articles = articles.filter(a => a.id !== id);
  await saveArticles(articles);
  
  invalidateCache();
  
  revalidatePath('/');
  revalidatePath('/admin');
  
  return { success: true };
}

export async function uploadImage(formData: FormData) {
  await requireCsrf();
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file uploaded');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\s+/g, '_');
  const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `${uniquePrefix}-${sanitized}`;
  
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    throw new Error('Invalid filename');
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, buffer);

  return { url: `/uploads/${filename}` };
}
