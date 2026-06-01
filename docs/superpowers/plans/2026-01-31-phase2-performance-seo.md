# Phase 2: Performance & SEO Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize Core Web Vitals to achieve Lighthouse 90+, add structured data, and implement caching for better search visibility.

**Architecture:** Build on Phase 1's stable foundation. Focus on client-side optimization (dynamic imports, images), server-side caching (ISR), and SEO metadata (JSON-LD).

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, next/dynamic, next/image

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/JsonLd.tsx` | Create | JSON-LD structured data components |
| `src/components/Skeletons.tsx` | Modify | Add loading skeletons for dynamic imports |
| `src/app/page.tsx` | Modify | Dynamic imports + ISR caching |
| `src/app/article/[slug]/page.tsx` | Modify | JSON-LD + ISR + generateStaticParams |
| `src/app/kategori/[kerajaan]/[subkategori]/page.tsx` | Modify | ISR caching + JSON-LD |
| `src/app/kamus/page.tsx` | Modify | Static generation |
| `src/app/silsilah/page.tsx` | Modify | Static generation |
| `src/app/sitemap.ts` | Modify | Enhanced sitemap with lastmod, priority |
| `src/app/layout.tsx` | Modify | Font preload |
| `src/components/HeadlineArticle.tsx` | Modify | Image optimization |
| `src/components/GridArticle.tsx` | Modify | Image optimization |
| `src/components/Breadcrumbs.tsx` | Modify | BreadcrumbList JSON-LD |
| `next.config.ts` | Modify | Image optimization config |

---

### Task 1: JSON-LD Structured Data

**Files:**
- Create: `src/components/JsonLd.tsx`

- [ ] **Step 1.1: Create JsonLd components**

Create `src/components/JsonLd.tsx`:

```typescript
import type { Article, Organization, BreadcrumbList, WebSite } from "schema-dts";

interface JsonLdProps<T> {
  data: T;
}

export function JsonLd<T extends Record<string, unknown>>({ data }: JsonLdProps<T>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  image,
  datePublished,
  author,
  url,
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  author: string;
  url: string;
}) {
  const data: Article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    author: { "@type": "Person", name: author },
    url,
    publisher: {
      "@type": "Organization",
      name: "NusaHistoria",
      logo: { "@type": "ImageObject", url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png` },
    },
  };

  return <JsonLd data={data} />;
}

export function OrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nusahistoria.com";
  const data: Organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NusaHistoria",
    url: baseUrl,
    description: "Ensiklopedia digital sejarah Islam Jawa",
    sameAs: [
      "https://github.com/RokanMarik/Website-Sejarah-Islam-Jawa",
    ],
  };

  return <JsonLd data={data} />;
}

export function BreadcrumbListJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data: BreadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

export function WebSiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nusahistoria.com";
  const data: WebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NusaHistoria",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/pencarian?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}
```

- [ ] **Step 1.2: Install schema-dts types**

```bash
bun add -d schema-dts
```

- [ ] **Step 1.3: Commit**

```bash
git add src/components/JsonLd.tsx package.json
git commit -m "feat(seo): add JSON-LD structured data components"
```

---

### Task 2: Dynamic Imports for Heavy Components

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/Skeletons.tsx`

- [ ] **Step 2.1: Add loading skeletons**

Modify `src/components/Skeletons.tsx` — add:

```typescript
export function MapSkeleton() {
  return (
    <div className="w-full h-64 bg-neutral-900 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Memuat peta interaktif...</span>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 bg-neutral-900 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}
```

- [ ] **Step 2.2: Convert JavaMap and Timeline to dynamic imports**

Modify `src/app/page.tsx` — replace direct imports:

```typescript
import dynamic from "next/dynamic";
import { MapSkeleton, TimelineSkeleton } from "@/components/Skeletons";

// Replace: import JavaMap from "@/components/JavaMap";
const JavaMap = dynamic(() => import("@/components/JavaMap"), {
  loading: () => <MapSkeleton />,
  ssr: false,
});

// Replace: import Timeline from "@/components/Timeline";
const Timeline = dynamic(() => import("@/components/Timeline"), {
  loading: () => <TimelineSkeleton />,
  ssr: false,
});
```

- [ ] **Step 2.3: Commit**

```bash
git add src/app/page.tsx src/components/Skeletons.tsx
git commit -m "perf: add dynamic imports for JavaMap and Timeline with loading skeletons"
```

---

### Task 3: Image Optimization

**Files:**
- Modify: `src/components/HeadlineArticle.tsx`
- Modify: `src/components/GridArticle.tsx`
- Modify: `src/app/article/[slug]/page.tsx`
- Modify: `next.config.ts`

- [ ] **Step 3.1: Update next.config.ts image settings**

Modify `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    sizes: [640, 750, 828, 1080, 1200, 1920],
    formats: ['image/avif', 'image/webp'],
  },
  // ... rest unchanged
};
```

- [ ] **Step 3.2: Optimize HeadlineArticle image**

Modify `src/components/HeadlineArticle.tsx`:

```typescript
<Image
  src={article.coverImage}
  alt={article.title}
  width={1200}
  height={630}
  priority
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
  className="w-full h-full object-cover"
/>
```

- [ ] **Step 3.3: Optimize GridArticle images**

Modify `src/components/GridArticle.tsx`:

```typescript
<Image
  src={article.coverImage}
  alt={article.title}
  width={600}
  height={400}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="w-full h-full object-cover"
/>
```

- [ ] **Step 3.4: Commit**

```bash
git add next.config.ts src/components/HeadlineArticle.tsx src/components/GridArticle.tsx
git commit -m "perf: optimize images with sizes, priority, and AVIF/WebP formats"
```

---

### Task 4: Add JSON-LD to Pages

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/article/[slug]/page.tsx`
- Modify: `src/components/Breadcrumbs.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 4.1: Add Organization schema to homepage**

Modify `src/app/page.tsx` — add to return:

```typescript
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";

// Inside Home component return, at top:
<OrganizationJsonLd />
<WebSiteJsonLd />
```

- [ ] **Step 4.2: Add Article schema to article pages**

Modify `src/app/article/[slug]/page.tsx`:

```typescript
import { ArticleJsonLd, BreadcrumbListJsonLd } from "@/components/JsonLd";

// Inside ArticlePage, after header:
<ArticleJsonLd
  title={article.title}
  description={article.excerpt}
  image={article.coverImage}
  datePublished={article.date}
  author={article.author}
  url={`${process.env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}`}
/>
```

- [ ] **Step 4.3: Add BreadcrumbList to Breadcrumbs component**

Modify `src/components/Breadcrumbs.tsx`:

```typescript
import { BreadcrumbListJsonLd } from "@/components/JsonLd";

// Inside Breadcrumbs component, add at end of return:
<BreadcrumbListJsonLd
  items={[
    { name: "Beranda", url: "/" },
    ...items.map(item => ({
      name: item.label,
      url: `/${item.label.toLowerCase()}`,
    })),
  ]}
/>
```

- [ ] **Step 4.4: Commit**

```bash
git add src/app/page.tsx "src/app/article/[slug]/page.tsx" src/components/Breadcrumbs.tsx src/app/layout.tsx
git commit -m "feat(seo): add JSON-LD structured data to all pages"
```

---

### Task 5: ISR Caching & Static Generation

**Files:**
- Modify: `src/app/article/[slug]/page.tsx`
- Modify: `src/app/kategori/[kerajaan]/[subkategori]/page.tsx`
- Modify: `src/app/kamus/page.tsx`
- Modify: `src/app/silsilah/page.tsx`

- [ ] **Step 5.1: Add ISR to article pages**

Modify `src/app/article/[slug]/page.tsx`:

```typescript
// Add at bottom of file:
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map(article => ({ slug: article.slug }));
}
```

- [ ] **Step 5.2: Add ISR to category pages**

Modify `src/app/kategori/[kerajaan]/[subkategori]/page.tsx`:

```typescript
export const revalidate = 21600; // Revalidate every 6 hours
```

- [ ] **Step 5.3: Add static generation to kamus page**

Modify `src/app/kamus/page.tsx`:

```typescript
export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate daily
```

- [ ] **Step 5.4: Add static generation to silsilah page**

Modify `src/app/silsilah/page.tsx`:

```typescript
export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate daily
```

- [ ] **Step 5.5: Commit**

```bash
git add "src/app/article/[slug]/page.tsx" "src/app/kategori/[kerajaan]/[subkategori]/page.tsx" src/app/kamus/page.tsx src/app/silsilah/page.tsx
git commit -m "perf: add ISR caching and static generation to pages"
```

---

### Task 6: Enhanced Sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 6.1: Update sitemap with metadata**

Replace `src/app/sitemap.ts`:

```typescript
import { MetadataRoute } from "next";
import { getArticles } from "@/lib/data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nusahistoria.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();

  const articleUrls = articles.map(article => ({
    url: `${baseUrl}/article/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "weekly" as const,
    priority: article.isHeadline ? 1.0 : 0.8,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/silsilah`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kamus`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kuis`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  return [...staticUrls, ...articleUrls];
}
```

- [ ] **Step 6.2: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): enhance sitemap with lastmod, changefreq, priority"
```

---

### Task 7: Font Optimization

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 7.1: Add font preloading**

Modify `src/app/layout.tsx` — update font definitions:

```typescript
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const merriweather = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
  preload: true,
});
```

- [ ] **Step 7.2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "perf: add font-display: swap and preload for critical fonts"
```

---

## Phase 2 Completion Checklist

After all tasks:

- [ ] JSON-LD structured data on all pages (Article, Organization, BreadcrumbList, WebSite)
- [ ] Dynamic imports for JavaMap, Timeline, AudioPlayer
- [ ] Image optimization with sizes, priority, AVIF/WebP
- [ ] ISR caching configured (articles: 1h, categories: 6h, static: 24h)
- [ ] Enhanced sitemap with lastmod, changefreq, priority
- [ ] Font optimization with swap + preload
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse SEO 95+
