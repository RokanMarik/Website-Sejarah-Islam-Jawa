# Performance + Rate Limit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement smart 3-tier rate limiting with sliding window, add in-memory caching to db.ts, and wire up cache invalidation.

**Architecture:** Replace single-tier rate limiter with tier-based sliding window. Add Map-based memory cache to db.ts. Invalidate cache on write operations.

**Tech Stack:** Next.js 16, TypeScript, libsql

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/rate-limiter.ts` | Rewrite | 3-tier sliding window rate limiter |
| `src/lib/db.ts` | Modify | Add memory cache layer |
| `src/app/actions.ts` | Modify | Add cache invalidation on save/delete |
| `src/app/api/auth/login/route.ts` | Modify | Use new tier-based rate limiter |
| `src/app/api/upload/route.ts` | Modify | Add strict tier rate limiting |
| `src/app/api/search/route.ts` | Modify | Add medium tier rate limiting |

---

### Task 1: Rewrite Rate Limiter — 3-Tier Sliding Window

**Files:**
- Rewrite: `src/lib/rate-limiter.ts`

- [ ] **Step 1: Replace rate-limiter.ts with 3-tier sliding window**

```typescript
export type RateLimitTier = 'strict' | 'medium' | 'loose';

interface TierConfig {
  limit: number;
  windowMs: number;
}

const TIER_CONFIGS: Record<RateLimitTier, TierConfig> = {
  strict: { limit: 5, windowMs: 60_000 },      // 5 req/min - upload, login, admin
  medium: { limit: 20, windowMs: 60_000 },      // 20 req/min - search, bookmarks
  loose:  { limit: 60, windowMs: 60_000 },      // 60 req/min - page views
};

// Sliding window: Map<ip, timestamps[]>
const store = new Map<string, { tier: RateLimitTier; timestamps: number[] }>();

export function checkRateLimit(ip: string, tier: RateLimitTier = 'loose'): { 
  allowed: boolean; 
  retryAfter?: number; 
  limit: number; 
  remaining: number;
} {
  const now = Date.now();
  const config = TIER_CONFIGS[tier];
  const key = `${ip}:${tier}`;
  
  let entry = store.get(key);
  
  if (!entry) {
    entry = { tier, timestamps: [now] };
    store.set(key, entry);
    return { allowed: true, limit: config.limit, remaining: config.limit - 1 };
  }
  
  // Remove timestamps outside the window (sliding window)
  entry.timestamps = entry.timestamps.filter(t => now - t < config.windowMs);
  
  if (entry.timestamps.length >= config.limit) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfter = Math.ceil((oldestInWindow + config.windowMs - now) / 1000);
    return { 
      allowed: false, 
      retryAfter, 
      limit: config.limit, 
      remaining: 0 
    };
  }
  
  entry.timestamps.push(now);
  return { 
    allowed: true, 
    limit: config.limit, 
    remaining: config.limit - entry.timestamps.length 
  };
}

export function getRateLimitHeaders(result: ReturnType<typeof checkRateLimit>): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    ...(result.retryAfter ? { 'Retry-After': String(result.retryAfter) } : {}),
  };
}

// Cleanup old entries (run periodically)
export function cleanupRateLimitStore() {
  const now = Date.now();
  const maxWindow = Math.max(...Object.values(TIER_CONFIGS).map(c => c.windowMs));
  
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter(t => now - t < maxWindow);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}
```

- [ ] **Step 2: Verify build passes**

- [ ] **Step 3: Commit**

```bash
cd Website-Sejarah-Islam-Jawa
git add src/lib/rate-limiter.ts
git commit -m "feat(rate-limiter): 3-tier sliding window rate limiter"
```

---

### Task 2: Add Memory Cache to db.ts

**Files:**
- Modify: `src/lib/db.ts`

- [ ] **Step 1: Add cache layer to db.ts**

Add at the top of the file (after imports):

```typescript
// In-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  if (entry) {
    cache.delete(key);
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(pattern?: string): void {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}
```

- [ ] **Step 2: Wrap `getArticles()` with cache**

```typescript
export async function getArticles() {
  const cached = getCached('articles:all');
  if (cached) return cached;

  const database = getDb();
  const result = await database.execute("SELECT * FROM articles ORDER BY date DESC");
  const articles = result.rows.map(row => ({
    ...row,
    isHeadline: (row as any).isHeadline === 1,
    tags: (row as any).tags ? JSON.parse((row as any).tags as string) : [],
    type: (row as any).type || 'regular',
    references: (row as any).references ? JSON.parse((row as any).references as string) : [],
  }));

  setCache('articles:all', articles);
  return articles;
}
```

- [ ] **Step 3: Wrap `getArticleBySlug()` with cache**

```typescript
export async function getArticleBySlug(slug: string) {
  const cacheKey = `article:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const database = getDb();
  const result = await database.execute({
    sql: "SELECT * FROM articles WHERE slug = ?",
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  const article = {
    ...row,
    isHeadline: (row as any).isHeadline === 1,
    tags: (row as any).tags ? JSON.parse((row as any).tags as string) : [],
    type: (row as any).type || 'regular',
    references: (row as any).references ? JSON.parse((row as any).references as string) : [],
  };

  setCache(cacheKey, article);
  return article;
}
```

- [ ] **Step 4: Verify build passes**

- [ ] **Step 5: Commit**

```bash
cd Website-Sejarah-Islam-Jawa
git add src/lib/db.ts
git commit -m "feat(db): add in-memory cache with 5-min TTL"
```

---

### Task 3: Wire Up Cache Invalidation in Actions

**Files:**
- Modify: `src/app/actions.ts`

- [ ] **Step 1: Import `invalidateCache` and call it on save/delete**

At the top of actions.ts:
```typescript
import { invalidateCache } from '@/lib/db';
```

In `saveArticle()`, after `await saveArticles(articles)`:
```typescript
invalidateCache(); // Clear all cache on save
```

In `deleteArticle()`, after `await saveArticles(articles)`:
```typescript
invalidateCache(); // Clear all cache on delete
```

- [ ] **Step 2: Verify build passes**

- [ ] **Step 3: Commit**

```bash
cd Website-Sejarah-Islam-Jawa
git add src/app/actions.ts
git commit -m "feat(actions): invalidate cache on article save/delete"
```

---

### Task 4: Apply Rate Limiting to API Routes

**Files:**
- Modify: `src/app/api/auth/login/route.ts`
- Modify: `src/app/api/upload/route.ts`
- Modify: `src/app/api/search/route.ts`

- [ ] **Step 1: Update login route to use new tier**

Replace the rate limiter import and call:
```typescript
import { checkRateLimit, cleanupRateLimitStore, getRateLimitHeaders } from "@/lib/rate-limiter";

// In POST function, replace checkRateLimit call:
const rateLimit = checkRateLimit(ip, 'strict');

// Update 429 response to include headers:
return NextResponse.json(
  { success: false, error: "Too many attempts. Please try again later." },
  { 
    status: 429,
    headers: { 
      "Retry-After": String(rateLimit.retryAfter || 60),
      ...getRateLimitHeaders(rateLimit),
    }
  }
);
```

- [ ] **Step 2: Add strict tier to upload route**

Add at the top:
```typescript
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
```

Add at the beginning of POST function (before processing):
```typescript
const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
const rateLimit = checkRateLimit(ip, 'strict');
if (!rateLimit.allowed) {
  return NextResponse.json(
    { success: false, message: 'Too many uploads. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter || 60), ...getRateLimitHeaders(rateLimit) } }
  );
}
```

- [ ] **Step 3: Add medium tier to search route**

Add at the top:
```typescript
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
```

Add at the beginning of GET function:
```typescript
const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
const rateLimit = checkRateLimit(ip, 'medium');
if (!rateLimit.allowed) {
  return NextResponse.json(
    { error: 'Too many searches. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter || 60), ...getRateLimitHeaders(rateLimit) } }
  );
}
```

- [ ] **Step 4: Verify build passes**

- [ ] **Step 5: Commit**

```bash
cd Website-Sejarah-Islam-Jawa
git add src/app/api/auth/login/route.ts src/app/api/upload/route.ts src/app/api/search/route.ts
git commit -m "feat(api): apply tier-based rate limiting to login, upload, search"
```

---

### Task 5: Final Verification

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
git log --oneline -15
```

Expected new commits (newest first):
1. `feat(api): apply tier-based rate limiting to login, upload, search`
2. `feat(actions): invalidate cache on article save/delete`
3. `feat(db): add in-memory cache with 5-min TTL`
4. `feat(rate-limiter): 3-tier sliding window rate limiter`
5. `docs: add performance + rate limit design spec`
