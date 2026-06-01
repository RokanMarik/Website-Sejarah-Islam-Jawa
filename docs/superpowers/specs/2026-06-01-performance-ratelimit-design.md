# Performance + Rate Limit — Design Spec

**Date:** 2026-06-01
**Status:** Approved
**Author:** Sri Baginda

## Problem

Current performance issues on NusaHistoria:
1. Database query on every request — no caching layer
2. Rate limiter is single-tier — same limit for all endpoints
3. No sliding window — fixed window allows burst at window boundaries

## Design Decisions

### 1. Smart Rate Limiter — 3 Tiers

Replace current single-tier rate limiter with 3 tiers:

| Tier | Endpoints | Limit | Window |
|---|---|---|---|
| **Strict** | `/api/upload`, admin actions, login | 5 req/min | 60s |
| **Medium** | `/pencarian` (search), `/bookmarks` | 20 req/min | 60s |
| **Loose** | Page views, article reads, homepage | 60 req/min | 60s |

**Sliding window** — Instead of fixed window (reset every minute), use sliding window log:
- Track timestamps of each request per IP
- Count requests in the last 60 seconds
- If count > limit, reject

**Response headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1717200000
```

### 2. Memory Cache — In-Process

Add in-memory caching layer in `db.ts`:

```typescript
// Cache store
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key: string) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

function invalidateCache(pattern?: string) {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) cache.delete(key);
    }
  } else {
    cache.clear();
  }
}
```

**Cached functions:**
- `getArticles()` → cache key: `"articles:all"`
- `getArticleBySlug(slug)` → cache key: `"article:${slug}"`

**Cache invalidation:**
- `saveArticle()` → clear all article cache
- `deleteArticle()` → clear all article cache
- Called from `actions.ts`

### 3. Files to Modify

| File | Change |
|---|---|
| `src/lib/rate-limiter.ts` | Replace with 3-tier sliding window rate limiter |
| `src/lib/db.ts` | Add memory cache layer for getArticles/getArticleBySlug |
| `src/app/actions.ts` | Call `invalidateCache()` on save/delete |
| `src/middleware.ts` | Update to use new tier-based rate limiter |

## Implementation Notes

- Rate limiter uses `Map<ip, timestamps[]>` for sliding window
- Cache uses `Map<string, {data, timestamp}>` — no external dependency
- Cache TTL: 5 minutes (configurable)
- Sliding window: 60 seconds (configurable)
- Rate limit response: HTTP 429 with retry-after header
- Cache miss: query DB, store in cache, return
- Cache hit: return cached data directly

## Success Criteria

- [ ] 3-tier rate limiter active (strict, medium, loose)
- [ ] Sliding window rate limiting (not fixed window)
- [ ] Memory cache in db.ts with 5-min TTL
- [ ] Cache invalidation on article save/delete
- [ ] Rate limit headers in response
- [ ] 429 response with retry-after when limit exceeded
- [ ] No new external dependencies
