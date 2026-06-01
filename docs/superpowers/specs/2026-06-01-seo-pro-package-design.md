# SEO Pro Package - Design Spec

**Date:** 2026-06-01
**Status:** Approved
**Project:** NusaHistoria (Website-Sejarah-Islam-Jawa)

---

## 1. Overview

### 1.1 Purpose
Implement comprehensive SEO improvements for NusaHistoria website to improve search engine visibility, social media sharing, and accessibility.

### 1.2 Scope
- Meta tags (global + dynamic per page)
- Open Graph + Twitter Cards
- JSON-LD structured data
- Sitemap.xml + robots.txt
- Canonical URLs
- Image alt tags optimization

### 1.3 Out of Scope
- Custom domain setup
- Google Ads integration
- Analytics implementation

---

## 2. Architecture

### 2.1 Files Changed/Created

```
src/app/
├── layout.tsx          ← Update: Global meta, OG, Twitter
├── page.tsx            ← Update: Homepage OG tags
├── article/[slug]/     ← Update: Dynamic meta, JSON-LD
├── sitemap.ts          ← NEW: Auto-generate sitemap
├── robots.ts           ← NEW: Robots.txt rules
└── [...404]/           ← Optional: Custom 404

src/lib/
└── seo.ts              ← NEW: SEO utilities

public/
└── og-image.png        ← NEW: Default OG image (1200x630)
```

### 2.2 Data Flow

```
Article Data → seo.ts → JSON-LD + Meta Tags → HTML Head → Google/Social
```

---

## 3. Feature Details

### 3.1 Global Meta Tags (`layout.tsx`)

```tsx
export const metadata: Metadata = {
  title: { 
    template: '%s | NusaHistoria', 
    default: 'NusaHistoria | Sejarah Islam Jawa' 
  },
  description: 'Mempelajari sejarah transisi kekuasaan dari Pengging, Pajang, hingga Kesultanan Mataram Islam.',
  keywords: ['sejarah islam', 'jawa', 'kerajaan', 'pengging', 'pajang', 'mataram', 'islam jawa'],
  authors: [{ name: 'Rokan Akbar Marik', url: 'https://instagram.com/rokanakbar14' }],
  creator: 'Rokan Akbar Marik',
  publisher: 'NusaHistoria',
  formatDetection: { email: false, telephone: false },
  robots: { index: true, follow: true },
}
```

### 3.2 Open Graph + Twitter Cards

```tsx
export const metadata: Metadata = {
  openGraph: {
    title: 'NusaHistoria | Sejarah Islam Jawa',
    description: 'Mempelajari sejarah transisi kekuasaan...',
    url: 'https://nusahistoria.vercel.app',
    siteName: 'NusaHistoria',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NusaHistoria' }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NusaHistoria | Sejarah Islam Jawa',
    description: 'Mempelajari sejarah transisi kekuasaan...',
    images: ['/og-image.png'],
    creator: '@rokanakbar14',
  },
}
```

### 3.3 Dynamic Article Meta (`article/[slug]/page.tsx`)

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImage || '/og-image.png', width: 1200, height: 630 }],
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}
```

### 3.4 JSON-LD Structured Data

```tsx
// article/[slug]/page.tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      image: article.coverImage,
      datePublished: article.date,
      author: { '@type': 'Person', name: article.author },
      publisher: { '@type': 'Organization', name: 'NusaHistoria' },
    }),
  }}
/>
```

### 3.5 Sitemap + Robots

**`sitemap.ts`:**
```tsx
import { getArticles } from '@/lib/data';

export default async function sitemap() {
  const articles = getArticles();
  
  return [
    { url: 'https://nusahistoria.vercel.app', lastModified: new Date() },
    ...articles.map(a => ({
      url: `https://nusahistoria.vercel.app/article/${a.slug}`,
      lastModified: new Date(a.date),
    })),
  ];
}
```

**`robots.ts`:**
```tsx
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin'] },
    sitemap: 'https://nusahistoria.vercel.app/sitemap.xml',
  };
}
```

---

## 4. Implementation Notes

### 4.1 Image Alt Tags
- Update all `<img>` tags with descriptive alt text
- Use article title for cover images
- Use context-aware descriptions for content images

### 4.2 Canonical URLs
- Add `<link rel="canonical" href="..." />` to all pages
- Use `usePathname()` hook for dynamic URLs

### 4.3 Internal Linking
- Add related articles section to article pages
- Add breadcrumb navigation
- Link to kategori pages from articles

---

## 5. Acceptance Criteria

- [ ] All pages have unique, descriptive title tags
- [ ] All pages have meta descriptions (150-160 chars)
- [ ] Open Graph tags work (test with Facebook Sharing Debugger)
- [ ] Twitter Cards work (test with Twitter Card Validator)
- [ ] JSON-LD validates (test with Google Rich Results Test)
- [ ] sitemap.xml is valid and includes all public pages
- [ ] robots.txt allows crawling of public pages, blocks admin
- [ ] All images have alt tags
- [ ] Canonical URLs are set correctly

---

## 6. Testing

### 6.1 Manual Testing
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Google Rich Results Test: https://search.google.com/test/rich-results
- Sitemap Validator: https://www.xml-sitemaps.com/validate-xml-sitemap.html

### 6.2 Automated Testing
- Lighthouse SEO audit score > 90
- No missing meta tags in production build
