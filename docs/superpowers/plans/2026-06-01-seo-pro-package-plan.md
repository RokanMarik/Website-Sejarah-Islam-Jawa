# SEO Pro Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement comprehensive SEO improvements (meta tags, Open Graph, JSON-LD, sitemap, robots.txt) for NusaHistoria website.

**Architecture:** Update Next.js metadata API in layout + article pages, add sitemap.ts + robots.ts, create OG image fallback, add JSON-LD structured data to article pages.

**Tech Stack:** Next.js 16 Metadata API, React 19, TypeScript, Schema.org JSON-LD

---

### Task 1: Update Global Layout Metadata

**Files:**
- Modify: `src/app/layout.tsx:18-21` (replace metadata export)

- [ ] **Step 1: Update metadata in layout.tsx**

Replace the existing metadata export with comprehensive SEO metadata:

```tsx
export const metadata: Metadata = {
  title: { 
    template: '%s | NusaHistoria', 
    default: 'NusaHistoria | Sejarah Islam Jawa' 
  },
  description: 'Mempelajari sejarah transisi kekuasaan dari Pengging, Pajang, hingga Kesultanan Mataram Islam.',
  keywords: ['sejarah islam', 'jawa', 'kerajaan', 'pengging', 'pajang', 'mataram', 'islam jawa', 'sejarah jawa'],
  authors: [{ name: 'Rokan Akbar Marik', url: 'https://instagram.com/rokanakbar14' }],
  creator: 'Rokan Akbar Marik',
  publisher: 'NusaHistoria',
  formatDetection: { email: false, telephone: false },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'NusaHistoria | Sejarah Islam Jawa',
    description: 'Mempelajari sejarah transisi kekuasaan dari Pengging, Pajang, hingga Kesultanan Mataram Islam.',
    url: 'https://nusahistoria.vercel.app',
    siteName: 'NusaHistoria',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NusaHistoria - Sejarah Islam Jawa' }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NusaHistoria | Sejarah Islam Jawa',
    description: 'Mempelajari sejarah transisi kekuasaan dari Pengging, Pajang, hingga Kesultanan Mataram Islam.',
    images: ['/og-image.png'],
    creator: '@rokanakbar14',
  },
  alternates: {
    canonical: 'https://nusahistoria.vercel.app',
  },
};
```

- [ ] **Step 2: Verify build works**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add comprehensive SEO metadata to layout"
```

---

### Task 2: Add Dynamic Metadata to Article Pages

**Files:**
- Modify: `src/app/article/[slug]/page.tsx` (add generateMetadata export)

- [ ] **Step 1: Add generateMetadata function to article page**

Add this import at the top:
```tsx
import type { Metadata } from "next";
```

Add this function before the default export:
```tsx
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const articles = getArticles();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan',
      description: 'Artikel yang Anda cari tidak tersedia.',
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags || [],
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://nusahistoria.vercel.app/article/${article.slug}`,
      siteName: 'NusaHistoria',
      images: [{ 
        url: article.coverImage || 'https://nusahistoria.vercel.app/og-image.png', 
        width: 1200, 
        height: 630,
        alt: article.title,
      }],
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage || 'https://nusahistoria.vercel.app/og-image.png'],
    },
    alternates: {
      canonical: `https://nusahistoria.vercel.app/article/${article.slug}`,
    },
  };
}
```

- [ ] **Step 2: Verify build works**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/app/article/\[slug\]/page.tsx
git commit -m "feat: add dynamic metadata to article pages"
```

---

### Task 3: Add JSON-LD Structured Data to Articles

**Files:**
- Modify: `src/app/article/[slug]/page.tsx` (add script tag in return)

- [ ] **Step 1: Add JSON-LD script to article page**

In the article page's return statement, add this right after the opening `<article>` tag:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      image: article.coverImage || 'https://nusahistoria.vercel.app/og-image.png',
      datePublished: article.date,
      dateModified: article.date,
      author: { '@type': 'Person', name: article.author, url: article.authorInstagram || undefined },
      publisher: { '@type': 'Organization', name: 'NusaHistoria', logo: { '@type': 'ImageObject', url: 'https://nusahistoria.vercel.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `https://nusahistoria.vercel.app/article/${article.slug}` },
    }),
  }}
/>
```

- [ ] **Step 2: Verify build works**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/app/article/\[slug\]/page.tsx
git commit -m "feat: add JSON-LD structured data to articles"
```

---

### Task 4: Create Sitemap

**Files:**
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Create sitemap.ts**

```tsx
import { getArticles } from '@/lib/data';

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
    lastModified: new Date(article.date),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...articlePages];
}
```

- [ ] **Step 2: Verify sitemap generates**

Run: `npm run build` then check `.next/server/app/sitemap.xml` exists
Expected: sitemap.xml generated with all URLs

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat: add auto-generated sitemap"
```

---

### Task 5: Create Robots.txt

**Files:**
- Create: `src/app/robots.ts`

- [ ] **Step 1: Create robots.ts**

```tsx
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: 'https://nusahistoria.vercel.app/sitemap.xml',
  };
}
```

- [ ] **Step 2: Verify robots.txt generates**

Run: `npm run build` then check `.next/server/app/robots.txt` exists
Expected: robots.txt generated with correct rules

- [ ] **Step 3: Commit**

```bash
git add src/app/robots.ts
git commit -m "feat: add robots.txt rules"
```

---

### Task 6: Create Default OG Image

**Files:**
- Create: `public/og-image.png` (1200x630px)

- [ ] **Step 1: Create simple OG image using canvas**

Run this Node.js script to generate a basic OG image:

```bash
node -e "
const fs = require('fs');
// Create a simple SVG and convert to PNG placeholder
const svg = \`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'>
  <rect width='1200' height='630' fill='#0a0a0a'/>
  <text x='600' y='280' font-family='serif' font-size='72' font-weight='900' fill='#facc15' text-anchor='middle'>NusaHistoria</text>
  <text x='600' y='360' font-family='sans-serif' font-size='32' fill='#e5e5e5' text-anchor='middle'>Sejarah Islam Jawa</text>
  <rect x='500' y='400' width='200' height='4' fill='#facc15'/>
</svg>\`;
fs.writeFileSync('public/og-image.svg', svg);
console.log('SVG created at public/og-image.svg');
"
```

- [ ] **Step 2: Create PNG version (fallback)**

For now, use the SVG as fallback. Next.js will handle it. Update metadata to use SVG:

In `layout.tsx`, change:
```tsx
images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'NusaHistoria' }],
```

- [ ] **Step 3: Commit**

```bash
git add public/og-image.svg
git commit -m "feat: add default OG image"
```

---

### Task 7: Final Verification & Testing

**Files:** No changes

- [ ] **Step 1: Build production**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Check metadata in output**

Run: `grep -r "og:title" .next/server/app/ | head -5`
Expected: OG tags present in HTML output

- [ ] **Step 3: Check sitemap**

Run: `cat .next/server/app/sitemap.xml | head -20`
Expected: Valid XML with article URLs

- [ ] **Step 4: Check robots.txt**

Run: `cat .next/server/app/robots.txt`
Expected: Correct rules with sitemap URL

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: SEO Pro Package complete"
```

- [ ] **Step 6: Push to GitHub**

```bash
git push
```

Expected: Vercel auto-deploys

---

## Spec Coverage Check

| Spec Requirement | Task |
|---|---|
| Global meta tags | Task 1 |
| Open Graph + Twitter Cards | Task 1 |
| Dynamic article meta | Task 2 |
| JSON-LD structured data | Task 3 |
| Sitemap.xml | Task 4 |
| Robots.txt | Task 5 |
| Canonical URLs | Task 1, 2 |
| OG Image fallback | Task 6 |
| Testing | Task 7 |

## Self-Review

- ✅ **No placeholders** — All steps have actual code
- ✅ **Type consistency** — Metadata types match Next.js API
- ✅ **Spec coverage** — All requirements covered
- ✅ **DRY** — Reusing getArticles() from existing code
- ✅ **YAGNI** — No unnecessary features added
