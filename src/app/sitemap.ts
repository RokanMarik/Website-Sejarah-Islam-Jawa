import { getArticles } from '@/lib/data';

// Parse Indonesian date format (e.g., "20 Mei 2026")
function parseIndonesianDate(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan: 0, Januari: 0, Feb: 1, Februari: 1, Mar: 2, Maret: 2, Apr: 3, April: 3,
    Mei: 4, Jun: 5, Juni: 5, Jul: 6, Juli: 6, Agu: 7, Agustus: 7, Sep: 8, September: 8,
    Okt: 9, Oktober: 9, Nov: 10, November: 10, Des: 11, Desember: 11,
  };
  
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]] ?? 0;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date();
}

export default async function sitemap() {
  const articles = getArticles();
  const baseUrl = 'https://nusahistoria.vercel.app';

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/kuis`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/kamus`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/silsilah`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  // Dynamic article pages
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/article/${article.slug}`,
    lastModified: parseIndonesianDate(article.date),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...articlePages];
}
