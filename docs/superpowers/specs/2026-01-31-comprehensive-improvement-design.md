# Design Spec: Comprehensive Improvement — NusaHistoria

**Date:** 2026-01-31  
**Status:** Approved  
**Approach:** Phased (3 phases)  
**Target:** Production-ready deployment on Vercel

---

## Overview

Comprehensive improvement of the NusaHistoria website (Next.js 16) across 3 sequential phases. Each phase is independently deployable and buildable upon the previous one.

### Current State
- Next.js 16.2.6, React 19.2.4, TypeScript 5
- better-sqlite3 for data (file-based, not serverless-compatible)
- Basic admin auth with hardcoded default password
- No tests, no vercel.json, no CI/CD
- Good SEO foundation (metadata, OG images, RSS, sitemap)
- Rich features: articles, quiz, kamus, timeline, JavaMap, audio player

### Goals
1. Fix all critical security issues before any production deployment
2. Migrate to serverless-compatible database (Turso/libSQL)
3. Optimize performance to achieve Lighthouse 90+ scores
4. Enhance SEO with structured data and caching
5. Add user-facing features (comments, bookmarks, enhanced search)
6. Polish UI/UX with animations and improved mobile experience

---

## Phase 1: Security & DevOps Foundation

**Goal:** Fix critical issues, prepare for safe production deployment on Vercel.

### 1.1 Environment Variables
**Problem:** Default credentials hardcoded in `src/app/api/auth/login/route.ts`.

**Solution:**
- Create `.env.example` with all required variables
- Move `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `DATABASE_URL` to environment variables
- Add validation at startup (throw error if required vars missing in production)
- Update `.gitignore` to exclude `.env.local`

**Files:**
- `.env.example` (new)
- `src/app/api/auth/login/route.ts` (modify)
- `src/lib/db.ts` (modify — read DATABASE_URL)
- `.gitignore` (modify)

### 1.2 Rate Limiting
**Problem:** No rate limiting on login endpoint — vulnerable to brute force.

**Solution:**
- Implement in-memory rate limiter (5 attempts per 15 minutes per IP)
- Use `Map` with timestamp tracking
- Return `429 Too Many Requests` when exceeded
- Include `Retry-After` header

**Files:**
- `src/lib/rate-limiter.ts` (new)
- `src/app/api/auth/login/route.ts` (modify)

### 1.3 File Upload Validation
**Problem:** Upload endpoint accepts any file type, no size limit.

**Solution:**
- Validate file type (images only: jpg, png, gif, webp)
- Enforce max file size (5MB)
- Sanitize filename (remove special characters, add timestamp prefix)
- Return proper error responses for invalid uploads

**Files:**
- `src/app/api/upload/route.ts` (modify)

### 1.4 Database Migration: SQLite → Turso
**Problem:** better-sqlite3 is file-based, doesn't work on Vercel serverless.

**Solution:**
- Replace `better-sqlite3` with `@libsql/client` (Turso)
- Turso API is nearly identical to better-sqlite3 — minimal code changes
- Use `DATABASE_URL` environment variable for connection
- Keep same table schema (articles, quiz_results, etc.)
- Local dev: use `file:local.db` mode (libSQL supports local files)
- Production: use Turso cloud URL

**Migration Steps:**
1. Install `@libsql/client`
2. Replace `import Database from "better-sqlite3"` with `import { createClient } from "@libsql/client"`
3. Update `getDb()` to return libSQL client
4. Update query syntax (libSQL uses `execute()` instead of `prepare().all()`)
5. Test locally with `file:local.db`
6. Create Turso database, run migration script

**Files:**
- `src/lib/db.ts` (modify)
- `package.json` (modify — replace better-sqlite3 with @libsql/client)

### 1.5 Vercel Configuration
**Problem:** No `vercel.json` — missing headers, caching, route config.

**Solution:**
- Create `vercel.json` with:
  - Security headers (CSP, X-Frame-Options, X-Content-Type-Options)
  - Cache headers for static assets
  - Route redirects (www → non-www, http → https)
  - Rewrites for API routes

**Files:**
- `vercel.json` (new)

### 1.6 CSRF Protection
**Problem:** Admin forms have no CSRF protection.

**Solution:**
- Generate CSRF token on session creation
- Validate token on all POST/PUT/DELETE mutations
- Store token in httpOnly cookie + hidden form field
- Use double-submit cookie pattern

**Files:**
- `src/lib/csrf.ts` (new)
- `src/app/api/auth/login/route.ts` (modify — set CSRF token)
- `src/app/admin/AdminClient.tsx` (modify — include CSRF token in requests)
- `src/app/actions.ts` (modify — validate CSRF token)

### 1.7 Basic Tests
**Problem:** Zero test coverage.

**Solution:**
- Set up Vitest with Next.js testing utilities
- Add tests for:
  - Auth login (success, failure, rate limiting)
  - Search API (query matching, scoring)
  - Article CRUD (create, read, update, delete)
  - Upload validation (valid image, invalid type, too large)
- Target: 60%+ coverage on critical paths

**Files:**
- `vitest.config.ts` (modify — already exists, enhance)
- `src/__tests__/auth.test.ts` (new)
- `src/__tests__/search.test.ts` (new)
- `src/__tests__/articles.test.ts` (new)
- `src/__tests__/upload.test.ts` (new)

### Phase 1 Deliverables
- [ ] All secrets in environment variables
- [ ] Rate limiting on auth
- [ ] File upload validation
- [ ] Turso database working locally and ready for cloud
- [ ] vercel.json configured
- [ ] CSRF protection on admin forms
- [ ] 60%+ test coverage on critical paths
- [ ] Deploy to Vercel successfully

---

## Phase 2: Performance & SEO Enhancement

**Goal:** Optimize Core Web Vitals, achieve Lighthouse 90+, improve search visibility.

### 2.1 Dynamic Imports
**Problem:** Heavy components loaded on every page, increasing initial bundle.

**Solution:**
- Use `next/dynamic` with `ssr: false` for:
  - `JavaMap` (client-side SVG, heavy)
  - `Timeline` (animation-heavy)
  - `AudioPlayer` (react-player dependency)
  - `JoditEditor` (already dynamic in admin, verify)
- Add loading skeletons for each

**Files:**
- `src/app/page.tsx` (modify — dynamic imports)
- `src/components/Skeletons.tsx` (modify — add map/timeline skeletons)

### 2.2 Image Optimization
**Problem:** Images not fully optimized — missing sizes, priority, placeholders.

**Solution:**
- Add `sizes` attribute to all `next/image` instances
- Add `priority` to above-the-fold images (headline article)
- Add `placeholder="blur"` with low-res previews where possible
- Configure `imageSizes` in `next.config.ts`

**Files:**
- `src/components/HeadlineArticle.tsx` (modify)
- `src/components/GridArticle.tsx` (modify)
- `src/app/article/[slug]/page.tsx` (modify)
- `next.config.ts` (modify)

### 2.3 JSON-LD Structured Data
**Problem:** No structured data — missing rich snippets in search results.

**Solution:**
- Add `Article` schema to article pages
- Add `Organization` schema to homepage
- Add `BreadcrumbList` schema to all pages with breadcrumbs
- Add `WebSite` + `SearchAction` schema for sitelinks search

**Files:**
- `src/components/JsonLd.tsx` (new)
- `src/app/page.tsx` (modify — add Organization schema)
- `src/app/article/[slug]/page.tsx` (modify — add Article schema)
- `src/components/Breadcrumbs.tsx` (modify — add BreadcrumbList schema)

### 2.4 Caching & ISR
**Problem:** No caching strategy — every request hits the database.

**Solution:**
- Add `revalidate` to article pages (ISR: 1 hour)
- Add `revalidate` to category pages (ISR: 6 hours)
- Add static generation for kamus, silsilah, kontak pages
- Configure cache headers in vercel.json for static assets

**Files:**
- `src/app/article/[slug]/page.tsx` (modify — add generateStaticParams + revalidate)
- `src/app/kategori/[kerajaan]/[subkategori]/page.tsx` (modify)
- `src/app/kamus/page.tsx` (modify)
- `src/app/silsilah/page.tsx` (modify)

### 2.5 Sitemap Enhancement
**Problem:** Basic sitemap — missing lastmod, changefreq, priority.

**Solution:**
- Add `lastmod` based on article date
- Add `changefreq` per page type (articles: weekly, static: monthly)
- Add `priority` (headline: 1.0, articles: 0.8, static: 0.5)

**Files:**
- `src/app/sitemap.ts` (modify)

### 2.6 Font Optimization
**Problem:** Font swap causes layout shift (CLS).

**Solution:**
- Add `font-display: swap` (already done via next/font)
- Preload critical font files
- Add `fallback` font stacks to reduce CLS

**Files:**
- `src/app/layout.tsx` (modify — add preload)

### Phase 2 Deliverables
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse SEO 95+
- [ ] Dynamic imports for heavy components
- [ ] JSON-LD structured data on all pages
- [ ] ISR caching configured
- [ ] Enhanced sitemap
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms

---

## Phase 3: Features & UI Polish

**Goal:** Enhanced user experience, new features, visual polish.

### 3.1 Comments System
**Problem:** No way for readers to engage with articles.

**Solution:**
- Integrate Giscus (GitHub Discussions-based comments)
- Zero backend needed — uses GitHub repo as comment storage
- Add to article pages below content
- Theme matching Keraton design (dark/light)

**Files:**
- `src/components/GiscusComments.tsx` (new)
- `src/app/article/[slug]/page.tsx` (modify — add comments section)

### 3.2 Bookmarks & Reading History
**Problem:** No way to save articles for later.

**Solution:**
- localStorage-based bookmarks (client-side)
- Reading history tracking (last 20 articles viewed)
- "Bookmarked" indicator on article cards
- Bookmarks page (`/bookmarks`)
- Persist across sessions via localStorage

**Files:**
- `src/lib/bookmarks.ts` (new)
- `src/components/BookmarkButton.tsx` (new)
- `src/app/bookmarks/page.tsx` (new)
- `src/components/GridArticle.tsx` (modify — add bookmark indicator)
- `src/components/Navigation.tsx` (modify — add bookmarks link)

### 3.3 Quiz Results Persistence
**Problem:** Quiz results not saved — no leaderboard, no retry history.

**Solution:**
- Save quiz results to Turso database
- Create `quiz_results` table
- Show user's past attempts on quiz page
- Add leaderboard (top scores)
- Track improvement over time

**Files:**
- `src/lib/quiz-db.ts` (new)
- `src/app/api/quiz/route.ts` (new — save results)
- `src/app/kuis/QuizClient.tsx` (modify — save results, show history)
- `src/app/admin/quiz/results/page.tsx` (modify — show all results)

### 3.4 Search Enhancement
**Problem:** Basic search — no suggestions, no keyboard shortcut.

**Solution:**
- Add Ctrl+K / Cmd+K keyboard shortcut
- Search suggestions dropdown (top 5 results)
- Recent searches (localStorage, last 5)
- Fuzzy matching (allow typos)
- Search modal overlay

**Files:**
- `src/components/SearchModal.tsx` (new)
- `src/lib/search-utils.ts` (new — fuzzy matching)
- `src/components/Navigation.tsx` (modify — add Ctrl+K trigger)
- `src/app/api/search/route.ts` (modify — add fuzzy matching)

### 3.5 Animations & Transitions
**Problem:** Static UI — no visual polish.

**Solution:**
- Add Framer Motion for:
  - Page transitions (fade + slide)
  - Scroll reveal animations (articles, timeline)
  - Hover effects on cards
  - Dropdown animations
- Keep animations subtle — respect `prefers-reduced-motion`

**Files:**
- `src/components/MotionWrapper.tsx` (new)
- `src/app/layout.tsx` (modify — add AnimatePresence)
- `src/components/GridArticle.tsx` (modify — add scroll reveal)
- `src/components/Timeline.tsx` (modify — add scroll reveal)
- `src/components/Navigation.tsx` (modify — dropdown animation)

### 3.6 Mobile Menu Improvement
**Problem:** Basic mobile menu — no slide-out drawer.

**Solution:**
- Replace basic dropdown with slide-out drawer
- Add backdrop overlay
- Animate open/close
- Include search bar in drawer
- Add quick links (bookmarks, kamus, silsilah)

**Files:**
- `src/components/MobileMenu.tsx` (new)
- `src/components/Navigation.tsx` (modify — use MobileMenu)

### 3.7 Pagination / Infinite Scroll
**Problem:** No pagination — all articles load at once.

**Solution:**
- Add "Load More" button on homepage article list
- Paginate search results (10 per page)
- Paginate category pages (10 per page)
- Add page numbers + prev/next navigation

**Files:**
- `src/app/page.tsx` (modify — add pagination)
- `src/app/pencarian/page.tsx` (modify — add pagination)
- `src/app/kategori/[kerajaan]/[subkategori]/page.tsx` (modify)

### Phase 3 Deliverables
- [ ] Comments system on article pages
- [ ] Bookmarks & reading history
- [ ] Quiz results persisted + leaderboard
- [ ] Enhanced search with Ctrl+K
- [ ] Framer Motion animations
- [ ] Improved mobile menu
- [ ] Pagination on article lists

---

## Architecture Decisions

### Database: Turso (libSQL)
- **Why:** Serverless-compatible, same SQLite semantics, free tier generous
- **Trade-off:** Requires external service (Turso cloud) for production
- **Migration:** Near-zero — API is nearly identical to better-sqlite3
- **Local dev:** Use `file:local.db` mode

### Comments: Giscus
- **Why:** Zero backend, uses GitHub Discussions, free, open-source
- **Trade-off:** Requires GitHub account to comment
- **Alternative considered:** Disqus (ads, privacy concerns), custom backend (complexity)

### Bookmarks: localStorage
- **Why:** Simple, no backend needed, works offline
- **Trade-off:** Not synced across devices
- **Future:** Can upgrade to Supabase/Turso if cross-device sync needed

### Animations: Framer Motion
- **Why:** React-friendly, respects prefers-reduced-motion, well-maintained
- **Trade-off:** Adds ~30KB to bundle (but only loaded on client)

---

## Dependencies to Add

### Phase 1
- `@libsql/client` — Turso database client
- `vitest` — already in devDependencies, enhance config

### Phase 2
- No new dependencies

### Phase 3
- `framer-motion` — animations
- `giscus` — @giscus/react component

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Turso migration breaks existing queries | High | Test locally with file: mode first, comprehensive test suite |
| Framer Motion increases bundle size | Medium | Dynamic import, only load on pages that need it |
| Giscus requires GitHub account | Low | Acceptable for niche history website audience |
| Phase 3 features delay launch | Medium | Phase 1 & 2 can launch independently |

---

## Success Metrics

- **Security:** 0 critical issues, all secrets in env vars
- **Performance:** Lighthouse Performance 90+, LCP < 2.5s
- **SEO:** Lighthouse SEO 95+, structured data validated
- **DevOps:** Successful Vercel deployment, 60%+ test coverage
- **Features:** Comments, bookmarks, enhanced search all functional
- **UX:** Animations smooth, mobile menu usable, pagination works
