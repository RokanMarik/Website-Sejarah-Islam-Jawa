# Artikel Ilmiah Populer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add "Artikel Ilmiah Populer" feature — essay-style articles with references, sticky author sidebar, and dedicated homepage section.

**Architecture:** Add `type` field to Article model, modify DB schema, add homepage section, modify article page layout, update admin form.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, TypeScript, libsql

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/data.ts` | Modify | Add `type`, `references` to Article interface |
| `src/lib/db.ts` | Modify | Add columns `type`, `references` to articles table |
| `src/app/page.tsx` | Modify | Add "Bacaan Ilmiah" section |
| `src/components/GridArticle.tsx` | Modify | Add variant card for scientific articles |
| `src/app/article/[slug]/page.tsx` | Modify | Layout 2-col + sticky sidebar for scientific, show references |
| `src/app/admin/AdminClient.tsx` | Modify | Add type selector + references input |
| `src/app/actions.ts` | Modify | Update saveArticle to handle new fields |
| `src/components/ScientificArticleCard.tsx` | Create | New component for scientific article cards |

---

### Task 1: Data Model & DB Schema — Add `type` and `references`

**Files:**
- Modify: `src/lib/data.ts`
- Modify: `src/lib/db.ts`

- [ ] **Step 1: Update Article interface in `data.ts`**

Add these fields to the Article interface:
```typescript
export interface Article {
  // ... existing fields ...
  type?: 'regular' | 'scientific';
  references?: string[];
}
```

- [ ] **Step 2: Update DB schema in `db.ts`**

Add columns to the `CREATE TABLE` statement:
```sql
CREATE TABLE IF NOT EXISTS articles (
  -- ... existing columns ...
  type TEXT DEFAULT 'regular',
  references TEXT
)
```

Also update `getArticles()` to parse references:
```typescript
tags: (row as any).tags ? JSON.parse((row as any).tags as string) : [],
references: (row as any).references ? JSON.parse((row as any).references as string) : [],
type: (row as any).type || 'regular',
```

And update `saveArticles()` to include new fields in INSERT:
```sql
INSERT OR REPLACE INTO articles 
  (..., type, references)
  VALUES (?, ..., ?, ?)
```

With args:
```typescript
article.type || 'regular',
JSON.stringify(article.references || []),
```

Also update `getArticleBySlug()` similarly.

- [ ] **Step 3: Verify build passes**

Run: `cd Website-Sejarah-Islam-Jawa && bun run build`

- [ ] **Step 4: Commit**

```bash
cd Website-Sejarah-Islam-Jawa
git add src/lib/data.ts src/lib/db.ts
git commit -m "feat(db): add type and references fields to Article model"
```

---

### Task 2: Create Scientific Article Card Component

**Files:**
- Create: `src/components/ScientificArticleCard.tsx`
- Modify: `src/components/GridArticle.tsx` (optional — or use new component directly)

- [ ] **Step 1: Create `ScientificArticleCard.tsx`**

New component for scientific article cards, different from GridArticle:

```tsx
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/data";

export default function ScientificArticleCard({ article }: { article: Article }) {
  const refCount = article.references?.length || 0;

  return (
    <article className="group flex flex-col bg-neutral-950/50 border border-gray-800 hover:border-yellow-400/50 transition-colors">
      {/* Cover Image */}
      <Link href={`/article/${article.slug}`} className="relative aspect-[4/3] overflow-hidden border-b border-gray-800">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover grayscale mix-blend-luminosity opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-yellow-400/90 text-black text-[10px] font-bold uppercase tracking-widest">
            📖 Ilmiah
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/article/${article.slug}`}>
          <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 leading-snug mb-1 transition-colors font-serif">
            {article.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
          oleh {article.author}
        </p>
        <p className="text-gray-400 text-sm font-serif line-clamp-3 mb-4 leading-relaxed flex-grow">
          {article.excerpt}
        </p>
        <div className="flex items-center text-xs text-gray-600 uppercase tracking-wider gap-3">
          <span className="text-yellow-600">{refCount} referensi</span>
          <span className="text-gray-700">◆</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Verify build passes**

- [ ] **Step 3: Commit**

```bash
cd Website-Sejarah-Islam-Jawa
git add src/components/ScientificArticleCard.tsx
git commit -m "feat(ui): add ScientificArticleCard component"
```

---

### Task 3: Homepage — Add "Bacaan Ilmiah" Section

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add section to homepage**

Insert between `</div>` (after ArticleList section) and `<PopularArticles>`:

```tsx
{/* Bacaan Ilmiah Section */}
{(() => {
  const scientificArticles = articles.filter(a => a.type === 'scientific').slice(0, 3);
  if (scientificArticles.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-20 relative z-10">
      <div className="border-b border-gray-800 pb-3 mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-white font-serif">📖 Bacaan Ilmiah</h2>
        <Link href="/ilmiah" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors font-sans uppercase tracking-widest">
          Lihat Semua →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {scientificArticles.map(article => (
          <ScientificArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
})()}
```

Also add imports at top:
```tsx
import ScientificArticleCard from "@/components/ScientificArticleCard";
import Link from "next/link";
```

- [ ] **Step 2: Verify build passes**

- [ ] **Step 3: Commit**

```bash
cd Website-Sejarah-Islam-Jawa
git add src/app/page.tsx
git commit -m "feat(homepage): add Bacaan Ilmiah section"
```

---

### Task 4: Article Page — Sticky Sidebar + References

**Files:**
- Modify: `src/app/article/[slug]/page.tsx`

- [ ] **Step 1: Add author name below title**

After the `<h1>` tag, add author line:
```tsx
<p className="text-lg text-gray-400 font-serif mb-4">
  oleh <span className="text-yellow-400 font-bold">{article.author}</span>
</p>
```

- [ ] **Step 2: Add references to sticky sidebar (for scientific articles)**

In the existing sticky sidebar (Column 1: Sticky Author Info), after the Instagram button section, add:

```tsx
{article.type === 'scientific' && article.references && article.references.length > 0 && (
  <div className="mt-8 pt-8 border-t border-gray-800">
    <div className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-sans">
      📚 Referensi ({article.references.length})
    </div>
    <ol className="space-y-3 text-xs text-gray-400 font-serif leading-relaxed">
      {article.references.map((ref, i) => (
        <li key={i} className="pl-4 -indent-4">
          <span className="text-yellow-600 mr-1">{i + 1}.</span>
          {ref}
        </li>
      ))}
    </ol>
  </div>
)}
```

- [ ] **Step 3: Add references section at bottom of article content (for mobile + additional visibility)**

After the Glossary component and before "Topik Terkait", add:

```tsx
{article.type === 'scientific' && article.references && article.references.length > 0 && (
  <div className="mt-16 pt-8 border-t-2 border-gray-800">
    <h3 className="font-bold font-serif text-2xl text-yellow-400 mb-6 flex items-center gap-3">
      <span>📚</span> Daftar Referensi
    </h3>
    <ol className="space-y-4 text-sm text-gray-400 font-serif leading-relaxed">
      {article.references.map((ref, i) => (
        <li key={i} className="pl-6 -indent-6 pb-4 border-b border-gray-900 last:border-0">
          <span className="text-yellow-600 font-bold mr-2">{i + 1}.</span>
          {ref}
        </li>
      ))}
    </ol>
  </div>
)}
```

- [ ] **Step 4: Verify build passes**

- [ ] **Step 5: Commit**

```bash
cd Website-Sejarah-Islam-Jawa
git add src/app/article/\[slug\]/page.tsx
git commit -m "feat(article): add author below title, sticky references sidebar, references section"
```

---

### Task 5: Admin — Type Selector + References Input

**Files:**
- Modify: `src/app/admin/AdminClient.tsx`
- Modify: `src/app/actions.ts`

- [ ] **Step 1: Update newArticleTemplate in AdminClient.tsx**

Add `type` and `references` to the template:
```typescript
const newArticleTemplate: Article = {
  // ... existing fields ...
  type: 'regular',
  references: [],
};
```

- [ ] **Step 2: Add type selector in the form**

Insert after the "Kategori / Kerajaan" select:

```tsx
<div className="space-y-2">
  <label className="block text-sm font-semibold text-gray-700">Tipe Artikel</label>
  <div className="flex gap-4">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="articleType"
        value="regular"
        checked={editingArticle.type === 'regular'}
        onChange={e => setEditingArticle({...editingArticle, type: e.target.value as 'regular' | 'scientific'})}
        className="w-4 h-4 text-blue-600"
      />
      <span className="text-sm text-gray-700">Biasa</span>
    </label>
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="articleType"
        value="scientific"
        checked={editingArticle.type === 'scientific'}
        onChange={e => setEditingArticle({...editingArticle, type: e.target.value as 'regular' | 'scientific'})}
        className="w-4 h-4 text-blue-600"
      />
      <span className="text-sm text-gray-700">Ilmiah</span>
    </label>
  </div>
</div>
```

- [ ] **Step 3: Add references textarea (only visible for scientific type)**

Insert before the Excerpt textarea:

```tsx
{editingArticle.type === 'scientific' && (
  <div className="space-y-2 md:col-span-2">
    <label className="block text-sm font-semibold text-gray-700">Daftar Referensi (satu per baris)</label>
    <textarea
      rows={5}
      placeholder={`1. Kuntowijoyo. (2002). Pengantar Ilmu Sejarah. Yogyakarta: Penerbit Ombak.\n2. Ricklefs, M.C. (2005). Sejarah Indonesia Modern. Jakarta: UGM Press.`}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono text-sm"
      value={editingArticle.references?.join('\n') || ''}
      onChange={e => {
        const refs = e.target.value.split('\n').map(r => r.trim()).filter(r => r);
        setEditingArticle({...editingArticle, references: refs});
      }}
    />
    <p className="text-xs text-gray-500">Satu referensi per baris. Format: Author. (Tahun). Judul. Publisher.</p>
  </div>
)}
```

- [ ] **Step 4: Update actions.ts to handle new fields**

Read `src/app/actions.ts` and ensure `saveArticle` passes `type` and `references`:

```typescript
// In saveArticle function, add to the article object being saved:
type: article.type || 'regular',
references: article.references || [],
```

- [ ] **Step 5: Add type column to article list table**

In the article list table, add a Type column:

```tsx
// In the <th> row:
<th className="p-4 font-semibold hidden lg:table-cell">Tipe</th>

// In the <td> row:
<td className="p-4 text-center hidden lg:table-cell">
  {article.type === 'scientific' && (
    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase rounded-sm">Ilmiah</span>
  )}
</td>
```

- [ ] **Step 6: Verify build passes**

- [ ] **Step 7: Commit**

```bash
cd Website-Sejarah-Islam-Jawa
git add src/app/admin/AdminClient.tsx src/app/actions.ts
git commit -m "feat(admin): add type selector and references input for scientific articles"
```

---

### Task 6: Final Verification

**Files:**
- All modified files

- [ ] **Step 1: Run full build**

Run: `cd Website-Sejarah-Islam-Jawa && bun run build`
Expected: No errors

- [ ] **Step 2: Run lint**

Run: `cd Website-Sejarah-Islam-Jawa && bun run lint`
Expected: No new lint errors

- [ ] **Step 3: Verify all commits**

```bash
cd Website-Sejarah-Islam-Jawa
git log --oneline -8
```

Expected commits (newest first):
1. `feat(admin): add type selector and references input for scientific articles`
2. `feat(article): add author below title, sticky references sidebar, references section`
3. `feat(homepage): add Bacaan Ilmiah section`
4. `feat(ui): add ScientificArticleCard component`
5. `feat(db): add type and references fields to Article model`
6. `docs: add artikel ilmiah populer design spec`
7. `feat(footer): 3-column layout, remove newsletter, add Saweria support`
8. `feat(nav): remove Beranda link, consolidate search, narrow dropdown`
