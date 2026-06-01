# Phase 3: Features & UI Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add user-facing features (comments, bookmarks, quiz persistence, enhanced search) and polish UI with animations and improved mobile experience.

**Architecture:** Build on Phases 1 & 2. Features are mostly client-side (localStorage for bookmarks) or use Turso database (quiz results). Animations via Framer Motion.

**Tech Stack:** Next.js 16, React 19, Framer Motion, @giscus/react, localStorage, Turso

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/GiscusComments.tsx` | Create | Giscus comments integration |
| `src/lib/bookmarks.ts` | Create | localStorage bookmarks & reading history |
| `src/components/BookmarkButton.tsx` | Create | Bookmark toggle button |
| `src/app/bookmarks/page.tsx` | Create | Bookmarks listing page |
| `src/lib/quiz-db.ts` | Create | Turso-based quiz results storage |
| `src/app/api/quiz/route.ts` | Create | API for saving/fetching quiz results |
| `src/components/SearchModal.tsx` | Create | Ctrl+K search modal |
| `src/lib/search-utils.ts` | Create | Fuzzy search utilities |
| `src/components/MotionWrapper.tsx` | Create | Framer Motion animation wrappers |
| `src/components/MobileMenu.tsx` | Create | Slide-out mobile menu |
| `src/app/article/[slug]/page.tsx` | Modify | Add comments section |
| `src/components/GridArticle.tsx` | Modify | Add bookmark indicator |
| `src/components/Navigation.tsx` | Modify | Add search modal trigger + mobile menu |
| `src/app/kuis/QuizClient.tsx` | Modify | Save results to Turso, show history |
| `src/app/layout.tsx` | Modify | Add AnimatePresence |
| `package.json` | Modify | Add framer-motion, @giscus/react |

---

### Task 1: Comments System (Giscus)

**Files:**
- Create: `src/components/GiscusComments.tsx`
- Modify: `src/app/article/[slug]/page.tsx`
- Modify: `package.json`

- [ ] **Step 1.1: Install giscus**

```bash
bun add @giscus/react
```

- [ ] **Step 1.2: Create GiscusComments component**

Create `src/components/GiscusComments.tsx`:

```typescript
'use client';

import Giscus from "@giscus/react";
import { useTheme } from "./ThemeController";

export default function GiscusComments({
  repo,
  repoId,
  category,
  categoryId,
}: {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="mt-12 pt-8 border-t border-gray-800">
      <h3 className="text-2xl font-bold uppercase tracking-widest text-yellow-400 font-serif mb-6">
        Komentar
      </h3>
      <Giscus
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={isDark ? "dark" : "light"}
        lang="id"
        loading="lazy"
      />
    </div>
  );
}
```

- [ ] **Step 1.3: Add comments to article page**

Modify `src/app/article/[slug]/page.tsx` — add at bottom of article content:

```typescript
import GiscusComments from "@/components/GiscusComments";

// After article content, before RelatedArticles:
{process.env.NEXT_PUBLIC_GISCUS_REPO && (
  <GiscusComments
    repo={process.env.NEXT_PUBLIC_GISCUS_REPO}
    repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ""}
    category="Comments"
    categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ""}
  />
)}
```

- [ ] **Step 1.4: Add env vars to .env.example**

Add to `.env.example`:

```env
# Giscus Comments
NEXT_PUBLIC_GISCUS_REPO=your-org/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
```

- [ ] **Step 1.5: Commit**

```bash
git add src/components/GiscusComments.tsx src/app/article/\[slug\]/page.tsx .env.example package.json
git commit -m "feat: add Giscus comments system to article pages"
```

---

### Task 2: Bookmarks & Reading History

**Files:**
- Create: `src/lib/bookmarks.ts`
- Create: `src/components/BookmarkButton.tsx`
- Create: `src/app/bookmarks/page.tsx`
- Modify: `src/components/GridArticle.tsx`
- Modify: `src/components/Navigation.tsx`

- [ ] **Step 2.1: Create bookmarks utility**

Create `src/lib/bookmarks.ts`:

```typescript
const BOOKMARKS_KEY = "nusahistoria-bookmarks";
const HISTORY_KEY = "nusahistoria-history";
const MAX_HISTORY = 20;

export interface Bookmark {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  category: string;
  dateAdded: string;
}

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(BOOKMARKS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addBookmark(article: Bookmark): void {
  const bookmarks = getBookmarks();
  if (!bookmarks.find(b => b.id === article.id)) {
    bookmarks.unshift({ ...article, dateAdded: new Date().toISOString() });
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }
}

export function removeBookmark(id: string): void {
  const bookmarks = getBookmarks().filter(b => b.id !== id);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().some(b => b.id === id);
}

export function getReadingHistory(): { slug: string; title: string; dateViewed: string }[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addToHistory(article: { slug: string; title: string }): void {
  const history = getReadingHistory();
  // Remove if already exists
  const filtered = history.filter(h => h.slug !== article.slug);
  // Add to front
  filtered.unshift({ ...article, dateViewed: new Date().toISOString() });
  // Keep only last MAX_HISTORY
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, MAX_HISTORY)));
}
```

- [ ] **Step 2.2: Create BookmarkButton component**

Create `src/components/BookmarkButton.tsx`:

```typescript
'use client';

import { useState, useEffect } from "react";
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/bookmarks";
import { Article } from "@/lib/data";

export default function BookmarkButton({ article }: { article: Article }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(article.id));
  }, [article.id]);

  const toggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark({
        id: article.id,
        slug: article.slug,
        title: article.title,
        coverImage: article.coverImage,
        category: article.category,
        dateAdded: new Date().toISOString(),
      });
    }
    setBookmarked(!bookmarked);
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`p-2 rounded-full transition-colors ${
        bookmarked
          ? "text-yellow-400 hover:text-yellow-300"
          : "text-gray-400 hover:text-white"
      }`}
      aria-label={bookmarked ? "Hapus bookmark" : "Tambah bookmark"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  );
}
```

- [ ] **Step 2.3: Create bookmarks page**

Create `src/app/bookmarks/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBookmarks, removeBookmark, Bookmark } from "@/lib/bookmarks";
import Image from "next/image";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const handleRemove = (id: string) => {
    removeBookmark(id);
    setBookmarks(getBookmarks());
  };

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-12">
        <h1 className="text-4xl font-black uppercase tracking-widest text-yellow-400 font-serif mb-8">
          Bookmark
        </h1>

        {bookmarks.length === 0 ? (
          <p className="text-gray-400">Belum ada artikel yang di-bookmark.</p>
        ) : (
          <div className="grid gap-6">
            {bookmarks.map(bookmark => (
              <div
                key={bookmark.id}
                className="flex gap-4 p-4 bg-neutral-900 rounded-lg border border-gray-800"
              >
                <Link href={`/article/${bookmark.slug}`} className="flex-shrink-0 w-32 h-20 relative">
                  <Image
                    src={bookmark.coverImage}
                    alt={bookmark.title}
                    fill
                    className="object-cover rounded"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    href={`/article/${bookmark.slug}`}
                    className="text-white font-bold hover:text-yellow-400"
                  >
                    {bookmark.title}
                  </Link>
                  <p className="text-sm text-gray-400 mt-1">{bookmark.category}</p>
                  <button
                    onClick={() => handleRemove(bookmark.id)}
                    className="text-xs text-red-400 hover:text-red-300 mt-2"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2.4: Add bookmark indicator to GridArticle**

Modify `src/components/GridArticle.tsx`:

```typescript
import BookmarkButton from "./BookmarkButton";

// Add BookmarkButton near article title:
<div className="flex items-start justify-between">
  <h3 className="text-xl font-bold text-white hover:text-yellow-400">
    <Link href={`/article/${article.slug}`}>{article.title}</Link>
  </h3>
  <BookmarkButton article={article} />
</div>
```

- [ ] **Step 2.5: Add bookmarks link to navigation**

Modify `src/components/Navigation.tsx`:

```typescript
<Link href="/bookmarks" className="hover:text-yellow-400 transition-colors h-full flex items-center">
  Bookmark
</Link>
```

- [ ] **Step 2.6: Commit**

```bash
git add src/lib/bookmarks.ts src/components/BookmarkButton.tsx src/app/bookmarks/page.tsx src/components/GridArticle.tsx src/components/Navigation.tsx
git commit -m "feat: add bookmarks and reading history (localStorage)"
```

---

### Task 3: Quiz Results Persistence

**Files:**
- Create: `src/lib/quiz-db.ts`
- Create: `src/app/api/quiz/route.ts`
- Modify: `src/app/kuis/QuizClient.tsx`

- [ ] **Step 3.1: Create quiz database utility**

Create `src/lib/quiz-db.ts`:

```typescript
import { getDb } from "./db";

export interface QuizResult {
  id?: number;
  playerName: string;
  score: number;
  totalQuestions: number;
  category: string;
  rating?: string;
  createdAt?: string;
}

export async function saveQuizResult(result: QuizResult): Promise<QuizResult> {
  const database = getDb();
  const res = await database.execute({
    sql: `INSERT INTO quiz_results (playerName, score, totalQuestions, category, rating)
          VALUES (?, ?, ?, ?, ?)`,
    args: [result.playerName, result.score, result.totalQuestions, result.category, result.rating || ''],
  });

  return { ...result, id: res.lastInsertRowid as number };
}

export async function getQuizResults(limit = 50): Promise<QuizResult[]> {
  const database = getDb();
  const res = await database.execute({
    sql: "SELECT * FROM quiz_results ORDER BY score DESC, createdAt DESC LIMIT ?",
    args: [limit],
  });
  return res.rows as QuizResult[];
}

export async function getPlayerResults(playerName: string): Promise<QuizResult[]> {
  const database = getDb();
  const res = await database.execute({
    sql: "SELECT * FROM quiz_results WHERE playerName = ? ORDER BY createdAt DESC",
    args: [playerName],
  });
  return res.rows as QuizResult[];
}
```

- [ ] **Step 3.2: Create quiz API route**

Create `src/app/api/quiz/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { saveQuizResult, getQuizResults, getPlayerResults } from "@/lib/quiz-db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { playerName, score, totalQuestions, category, rating } = body;

  const result = await saveQuizResult({
    playerName,
    score,
    totalQuestions,
    category: category || "Campuran",
    rating,
  });

  return NextResponse.json({ success: true, result });
}

export async function GET(request: NextRequest) {
  const playerName = request.nextUrl.searchParams.get("player");
  
  if (playerName) {
    const results = await getPlayerResults(playerName);
    return NextResponse.json({ results });
  }

  const results = await getQuizResults();
  return NextResponse.json({ results });
}
```

- [ ] **Step 3.3: Update QuizClient to save results**

Modify `src/app/kuis/QuizClient.tsx` — replace Google Sheets call with Turso:

```typescript
// Replace submitQuizResult call with:
const saveResult = async () => {
  try {
    await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerName,
        score,
        totalQuestions,
        category,
        rating,
      }),
    });
  } catch (error) {
    console.error("Failed to save quiz result:", error);
  }
};
```

- [ ] **Step 3.4: Commit**

```bash
git add src/lib/quiz-db.ts src/app/api/quiz/route.ts src/app/kuis/QuizClient.tsx
git commit -m "feat: persist quiz results to Turso database"
```

---

### Task 4: Enhanced Search with Ctrl+K

**Files:**
- Create: `src/components/SearchModal.tsx`
- Create: `src/lib/search-utils.ts`
- Modify: `src/components/Navigation.tsx`
- Modify: `src/app/api/search/route.ts`

- [ ] **Step 4.1: Create fuzzy search utility**

Create `src/lib/search-utils.ts`:

```typescript
export function fuzzyMatch(text: string, query: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Exact match
  if (lowerText.includes(lowerQuery)) return true;
  
  // Fuzzy match: all query chars appear in order
  let textIdx = 0;
  for (const char of lowerQuery) {
    const foundIdx = lowerText.indexOf(char, textIdx);
    if (foundIdx === -1) return false;
    textIdx = foundIdx + 1;
  }
  return true;
}

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("nusahistoria-recent-searches");
  return stored ? JSON.parse(stored) : [];
}

export function addRecentSearch(query: string): void {
  if (typeof window === "undefined") return;
  const searches = getRecentSearches().filter(s => s !== query);
  searches.unshift(query);
  localStorage.setItem("nusahistoria-recent-searches", JSON.stringify(searches.slice(0, 5)));
}
```

- [ ] **Step 4.2: Create SearchModal component**

Create `src/components/SearchModal.tsx`:

```typescript
'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fuzzyMatch, getRecentSearches, addRecentSearch } from "@/lib/search-utils";

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : document.getElementById("search-trigger")?.click();
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setRecentSearches(getRecentSearches());
    }
  }, [isOpen]);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data.results.slice(0, 5));
  };

  const selectResult = (slug: string) => {
    addRecentSearch(query);
    router.push(`/article/${slug}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24">
      <div className="w-full max-w-2xl bg-neutral-900 border border-yellow-400 rounded-lg shadow-2xl">
        <div className="p-4 border-b border-gray-800">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari artikel sejarah..."
            className="w-full bg-transparent text-white placeholder-gray-500 text-lg outline-none"
          />
          <span className="text-xs text-gray-500 mt-1 block">Ctrl+K untuk tutup</span>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {query.length < 2 && recentSearches.length > 0 && (
            <div className="p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Pencarian Terbaru</p>
              {recentSearches.map((search, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(search)}
                  className="w-full text-left py-2 text-gray-300 hover:text-yellow-400"
                >
                  🔍 {search}
                </button>
              ))}
            </div>
          )}

          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => selectResult(result.slug)}
              className="w-full text-left p-4 hover:bg-neutral-800 border-b border-gray-800"
            >
              <p className="text-white font-bold">{result.title}</p>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{result.snippet}</p>
            </button>
          ))}

          {query.length >= 2 && results.length === 0 && (
            <p className="p-4 text-gray-500">Tidak ada hasil untuk "{query}"</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4.3: Add search modal trigger to Navigation**

Modify `src/components/Navigation.tsx`:

```typescript
'use client';
import { useState } from "react";
import SearchModal from "./SearchModal";

// Add state:
const [isSearchOpen, setIsSearchOpen] = useState(false);

// Add trigger button:
<button
  id="search-trigger"
  onClick={() => setIsSearchOpen(true)}
  className="p-2 hover:text-yellow-400 transition-colors"
  aria-label="Search"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
</button>

// Add modal at end of component:
<SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
```

- [ ] **Step 4.4: Commit**

```bash
git add src/components/SearchModal.tsx src/lib/search-utils.ts src/components/Navigation.tsx
git commit -m "feat: add Ctrl+K search modal with fuzzy matching and recent searches"
```

---

### Task 5: Framer Motion Animations

**Files:**
- Create: `src/components/MotionWrapper.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/GridArticle.tsx`
- Modify: `package.json`

- [ ] **Step 5.1: Install framer-motion**

```bash
bun add framer-motion
```

- [ ] **Step 5.2: Create MotionWrapper component**

Create `src/components/MotionWrapper.tsx`:

```typescript
'use client';

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 5.3: Add AnimatePresence to layout**

Modify `src/app/layout.tsx`:

```typescript
'use client';
import { AnimatePresence } from "framer-motion";

// Wrap main content:
<AnimatePresence mode="wait">
  {children}
</AnimatePresence>
```

- [ ] **Step 5.4: Add scroll reveal to GridArticle**

Modify `src/components/GridArticle.tsx`:

```typescript
import { FadeIn } from "./MotionWrapper";

// Wrap article card:
<FadeIn>
  <article className="...">
    {/* existing content */}
  </article>
</FadeIn>
```

- [ ] **Step 5.5: Commit**

```bash
git add src/components/MotionWrapper.tsx src/app/layout.tsx src/components/GridArticle.tsx package.json
git commit -m "feat: add Framer Motion animations (fade-in, stagger, page transitions)"
```

---

### Task 6: Improved Mobile Menu

**Files:**
- Create: `src/components/MobileMenu.tsx`
- Modify: `src/components/Navigation.tsx`

- [ ] **Step 6.1: Create MobileMenu component**

Create `src/components/MobileMenu.tsx`:

```typescript
'use client';

import Link from "next/link";
import { useState } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menus: { title: string; submenus: string[] }[];
}

export default function MobileMenu({ isOpen, onClose, menus }: MobileMenuProps) {
  const [expandedKerajaan, setExpandedKerajaan] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-80 bg-neutral-950 border-l-2 border-yellow-400 overflow-y-auto">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <span className="text-yellow-400 font-bold uppercase tracking-wider">Menu</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-4">
          <Link href="/" onClick={onClose} className="block py-2 text-white hover:text-yellow-400 font-bold uppercase">
            Beranda
          </Link>

          {/* Kerajaan dropdown */}
          <div>
            <button
              onClick={() => setExpandedKerajaan(expandedKerajaan ? null : "kerajaan")}
              className="w-full text-left py-2 text-yellow-400 hover:text-yellow-300 font-bold uppercase flex justify-between"
            >
              Kerajaan Islam
              <span>{expandedKerajaan ? "▲" : "▼"}</span>
            </button>
            {expandedKerajaan && (
              <div className="pl-4 space-y-3 mt-2">
                {menus.map(menu => (
                  <div key={menu.title}>
                    <h4 className="text-white font-bold text-sm">{menu.title}</h4>
                    <ul className="pl-4 space-y-1 mt-1">
                      {menu.submenus.map(sub => (
                        <li key={sub}>
                          <Link
                            href={`/kategori/${menu.title.toLowerCase()}/${sub.toLowerCase()}`}
                            onClick={onClose}
                            className="text-gray-400 hover:text-white text-sm"
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/silsilah" onClick={onClose} className="block py-2 text-white hover:text-yellow-400 font-bold uppercase">
            Silsilah
          </Link>
          <Link href="/kamus" onClick={onClose} className="block py-2 text-white hover:text-yellow-400 font-bold uppercase">
            Kamus
          </Link>
          <Link href="/kuis" onClick={onClose} className="block py-2 text-white hover:text-yellow-400 font-bold uppercase">
            Kuis
          </Link>
          <Link href="/bookmarks" onClick={onClose} className="block py-2 text-white hover:text-yellow-400 font-bold uppercase">
            Bookmark
          </Link>
        </nav>
      </div>
    </div>
  );
}
```

- [ ] **Step 6.2: Replace mobile menu in Navigation**

Modify `src/components/Navigation.tsx` — replace existing mobile menu:

```typescript
import MobileMenu from "./MobileMenu";

// Replace mobile menu JSX with:
<MobileMenu
  isOpen={isMobileMenuOpen}
  onClose={() => setIsMobileMenuOpen(false)}
  menus={menus}
/>
```

- [ ] **Step 6.3: Commit**

```bash
git add src/components/MobileMenu.tsx src/components/Navigation.tsx
git commit -m "feat: add slide-out mobile menu with drawer and backdrop"
```

---

### Task 7: Pagination

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/pencarian/page.tsx`
- Modify: `src/app/kategori/[kerajaan]/[subkategori]/page.tsx`

- [ ] **Step 7.1: Add pagination to homepage**

Modify `src/app/page.tsx`:

```typescript
'use client';
import { useState } from "react";

const ARTICLES_PER_PAGE = 10;

export default function Home() {
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);
  
  // In article list section:
  {gridArticles.slice(0, visibleCount).map(article => (
    <GridArticle key={article.id} article={article} />
  ))}
  
  {visibleCount < gridArticles.length && (
    <button
      onClick={() => setVisibleCount(prev => prev + ARTICLES_PER_PAGE)}
      className="w-full py-3 mt-8 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold uppercase tracking-wider transition-colors"
    >
      Muat Lebih Banyak ({gridArticles.length - visibleCount} artikel lagi)
    </button>
  )}
}
```

- [ ] **Step 7.2: Add pagination to search page**

Modify `src/app/pencarian/page.tsx` — add similar "Load More" pattern.

- [ ] **Step 7.3: Commit**

```bash
git add src/app/page.tsx src/app/pencarian/page.tsx
git commit -m "feat: add 'Load More' pagination to article lists"
```

---

## Phase 3 Completion Checklist

After all tasks:

- [ ] Giscus comments on article pages
- [ ] Bookmarks & reading history (localStorage)
- [ ] Quiz results persisted to Turso + leaderboard
- [ ] Ctrl+K search modal with fuzzy matching
- [ ] Framer Motion animations (fade-in, stagger)
- [ ] Slide-out mobile menu
- [ ] Pagination on article lists
- [ ] All tests still passing
- [ ] `bun run build` succeeds
