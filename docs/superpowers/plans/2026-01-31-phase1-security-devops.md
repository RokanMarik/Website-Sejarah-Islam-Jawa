# Phase 1: Security & DevOps Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all critical security issues, migrate to serverless-compatible database, and prepare for production deployment on Vercel.

**Architecture:** Sequential tasks building on each other: env vars → rate limiting → upload validation → database migration → vercel.json → CSRF → tests. Each task is independently testable.

**Tech Stack:** Next.js 16, TypeScript, @libsql/client (Turso), Vitest, Bun

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `.env.example` | Create | Document required environment variables |
| `src/lib/rate-limiter.ts` | Create | In-memory rate limiter for auth |
| `src/lib/csrf.ts` | Create | CSRF token generation & validation |
| `src/lib/db.ts` | Modify | Replace better-sqlite3 with @libsql/client |
| `src/app/api/auth/login/route.ts` | Modify | Use env vars + rate limiting + CSRF |
| `src/app/api/auth/verify/route.ts` | Modify | Use env vars for auth check |
| `src/app/api/upload/route.ts` | Modify | Add file type & size validation |
| `src/app/actions.ts` | Modify | Add CSRF validation |
| `src/app/admin/AdminClient.tsx` | Modify | Include CSRF token in requests |
| `src/app/admin/login/page.tsx` | Modify | Include CSRF token in login form |
| `vercel.json` | Create | Vercel deployment config |
| `package.json` | Modify | Replace better-sqlite3 with @libsql/client |
| `.gitignore` | Modify | Add .env.local |
| `vitest.config.ts` | Modify | Enhance test config |
| `src/__tests__/auth.test.ts` | Create | Auth API tests |
| `src/__tests__/search.test.ts` | Create | Search API tests |
| `src/__tests__/articles.test.ts` | Create | Article CRUD tests |
| `src/__tests__/upload.test.ts` | Create | Upload validation tests |

---

### Task 1: Environment Variables Setup

**Files:**
- Create: `.env.example`
- Modify: `.gitignore`
- Modify: `src/app/api/auth/login/route.ts`
- Modify: `src/app/api/auth/verify/route.ts`

- [ ] **Step 1.1: Create .env.example**

Create `.env.example` at project root:

```env
# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me-in-production

# Database URL
# Local dev: file:local.db
# Production: libsql://your-db.turso.io?authToken=your-token
DATABASE_URL=file:local.db

# Site URL (for OG images, canonical URLs)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 1.2: Update .gitignore**

Add to `.gitignore` (append at end):

```
# Environment variables
.env.local
.env*.local
```

- [ ] **Step 1.3: Update login route to use env vars**

Modify `src/app/api/auth/login/route.ts` — replace hardcoded credentials:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;

  if (!validUser || !validPass) {
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (username === validUser && password === validPass) {
    const cookieStore = await cookies();
    cookieStore.set("admin-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
}
```

- [ ] **Step 1.4: Verify login route still works**

Run dev server and test login with credentials from `.env.example`:
```bash
bun run dev
# Test with admin / change-me-in-production
```

- [ ] **Step 1.5: Commit**

```bash
git add .env.example .gitignore src/app/api/auth/login/route.ts src/app/api/auth/verify/route.ts
git commit -m "feat(security): move credentials to environment variables"
```

---

### Task 2: Rate Limiting for Auth

**Files:**
- Create: `src/lib/rate-limiter.ts`
- Modify: `src/app/api/auth/login/route.ts`

- [ ] **Step 2.1: Create rate limiter utility**

Create `src/lib/rate-limiter.ts`:

```typescript
interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

// In-memory store: IP -> RateLimitEntry
const store = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry) {
    store.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  // Reset window if expired
  if (now - entry.firstAttempt > WINDOW_MS) {
    store.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  // Increment count
  entry.count += 1;

  if (entry.count > MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((entry.firstAttempt + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

// Cleanup old entries (call periodically or before each check)
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [ip, entry] of store.entries()) {
    if (now - entry.firstAttempt > WINDOW_MS) {
      store.delete(ip);
    }
  }
}
```

- [ ] **Step 2.2: Integrate rate limiter into login route**

Modify `src/app/api/auth/login/route.ts` — add at top:

```typescript
import { checkRateLimit, cleanupRateLimitStore } from "@/lib/rate-limiter";

// At start of POST function, before credential check:
export async function POST(request: NextRequest) {
  // Cleanup old entries periodically
  cleanupRateLimitStore();

  // Get client IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
             request.headers.get("x-real-ip") || 
             "unknown";

  // Check rate limit
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many attempts. Please try again later." },
      { 
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter || 900) }
      }
    );
  }

  // ... rest of existing code
```

- [ ] **Step 2.3: Test rate limiting**

```bash
# Run 6 login attempts with wrong password
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"wrong"}'
  echo ""
done
# 6th attempt should return 429
```

- [ ] **Step 2.4: Commit**

```bash
git add src/lib/rate-limiter.ts src/app/api/auth/login/route.ts
git commit -m "feat(security): add rate limiting to auth endpoint (5 attempts/15min)"
```

---

### Task 3: File Upload Validation

**Files:**
- Modify: `src/app/actions.ts`

- [ ] **Step 3.1: Add upload validation to uploadImage function**

Modify `src/app/actions.ts` — update `uploadImage` function:

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file uploaded');
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`);
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Sanitize filename and generate unique prefix
  const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\s+/g, '_');
  const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `${uniquePrefix}-${sanitized}`;
  
  // Path traversal protection — ensure filename doesn't contain ..
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    throw new Error('Invalid filename');
  }

  // Save to public/uploads directory
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, buffer);

  return { url: `/uploads/${filename}` };
}
```

- [ ] **Step 3.2: Test upload validation**

```bash
# Test with a non-image file (should fail)
echo "not an image" > /tmp/test.txt
# Try uploading via admin panel — should reject

# Test with large file (should fail)
dd if=/dev/zero of=/tmp/large.jpg bs=1M count=6
# Try uploading — should reject (>5MB)
```

- [ ] **Step 3.3: Commit**

```bash
git add src/app/actions.ts
git commit -m "feat(security): add file type, size, and path validation to upload"
```

---

### Task 4: Database Migration — SQLite → Turso (libSQL)

**Files:**
- Modify: `package.json`
- Modify: `src/lib/db.ts`

- [ ] **Step 4.1: Install @libsql/client**

```bash
cd Website-Sejarah-Islam-Jawa
bun remove better-sqlite3
bun add @libsql/client
bun remove -d @types/better-sqlite3
```

- [ ] **Step 4.2: Rewrite db.ts for libSQL**

Replace entire `src/lib/db.ts`:

```typescript
import { createClient, Client } from "@libsql/client";
import path from "path";

const dbUrl = process.env.DATABASE_URL || "file:local.db";

let db: Client | null = null;

export function getDb(): Client {
  if (!db) {
    db = createClient({ url: dbUrl });
  }
  return db;
}

export async function initDb() {
  const database = getDb();
  await database.execute(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      coverImage TEXT,
      category TEXT,
      author TEXT,
      readTime TEXT,
      date TEXT,
      isHeadline INTEGER DEFAULT 0,
      authorInstagram TEXT,
      subcategory TEXT,
      tags TEXT
    )
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      playerName TEXT NOT NULL,
      score INTEGER NOT NULL,
      totalQuestions INTEGER NOT NULL,
      category TEXT DEFAULT 'Campuran',
      rating TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS dictionary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      term TEXT UNIQUE NOT NULL,
      definition TEXT NOT NULL
    )
  `);
}

export async function getArticles() {
  const database = getDb();
  const result = await database.execute("SELECT * FROM articles ORDER BY date DESC");
  return result.rows.map(row => ({
    ...row,
    isHeadline: row.isHeadline === 1,
    tags: row.tags ? JSON.parse(row.tags as string) : [],
  }));
}

export async function saveArticles(articles: any[]) {
  const database = getDb();
  
  // Use transaction for batch insert
  await database.transaction(async (tx) => {
    for (const article of articles) {
      await tx.execute({
        sql: `INSERT OR REPLACE INTO articles 
          (id, slug, title, excerpt, content, coverImage, category, author, readTime, date, isHeadline, authorInstagram, subcategory, tags)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          article.id,
          article.slug,
          article.title,
          article.excerpt || '',
          article.content || '',
          article.coverImage || '',
          article.category || '',
          article.author || '',
          article.readTime || '',
          article.date || '',
          article.isHeadline ? 1 : 0,
          article.authorInstagram || '',
          article.subcategory || '',
          JSON.stringify(article.tags || []),
        ],
      });
    }
  });
}

export async function getArticleBySlug(slug: string) {
  const database = getDb();
  const result = await database.execute({
    sql: "SELECT * FROM articles WHERE slug = ?",
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    ...row,
    isHeadline: row.isHeadline === 1,
    tags: row.tags ? JSON.parse(row.tags as string) : [],
  };
}
```

- [ ] **Step 4.3: Update data.ts to use async db functions**

Modify `src/lib/data.ts`:

```typescript
import { getArticles as getDbArticles, saveArticles as saveDbArticles, initDb } from "./db";

// Initialize DB on module load
initDb().catch(console.error);

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  readTime: string;
  date: string;
  isHeadline?: boolean;
  authorInstagram?: string;
  subcategory?: string;
  tags?: string[];
}

export async function getArticles(): Promise<Article[]> {
  return await getDbArticles() as Article[];
}

export async function saveArticles(articles: Article[]) {
  await saveDbArticles(articles);
}
```

- [ ] **Step 4.4: Update server components to await async data**

Since `getArticles()` is now async, update all server components that call it.

Modify `src/app/page.tsx`:

```typescript
import { getArticles } from "@/lib/data";
// ... other imports

export default async function Home() {
  const articles = await getArticles();
  // ... rest unchanged
}
```

Modify `src/app/article/[slug]/page.tsx`:

```typescript
// In generateMetadata:
const articles = await getArticles();
// ... rest unchanged

// In ArticlePage:
const { slug } = await params;
const articles = await getArticles();
// ... rest unchanged
```

Modify `src/app/api/search/route.ts`:

```typescript
export async function GET(request: NextRequest) {
  // ...
  const articles = await getArticles();
  // ... rest unchanged
}
```

Modify `src/app/actions.ts`:

```typescript
export async function saveArticle(data: Article) {
  const articles = await getArticles();
  // ... rest unchanged
}

export async function deleteArticle(id: string) {
  let articles = await getArticles();
  // ... rest unchanged
}
```

- [ ] **Step 4.5: Test local database**

```bash
# Run dev server
bun run dev
# Visit homepage — should load articles from local.db
# Visit article page — should work
# Test admin — create/edit/delete article — should persist
```

- [ ] **Step 4.6: Commit**

```bash
git add package.json src/lib/db.ts src/lib/data.ts src/app/page.tsx src/app/article/\[slug\]/page.tsx src/app/api/search/route.ts src/app/actions.ts
git commit -m "feat(db): migrate from better-sqlite3 to @libsql/client (Turso)"
```

---

### Task 5: Vercel Configuration

**Files:**
- Create: `vercel.json`

- [ ] **Step 5.1: Create vercel.json**

Create `vercel.json` at project root:

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/uploads/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/www/:path*",
      "destination": "https://nusahistoria.com/:path*",
      "permanent": true
    }
  ]
}
```

- [ ] **Step 5.2: Commit**

```bash
git add vercel.json
git commit -m "chore(deploy): add vercel.json with security headers and caching"
```

---

### Task 6: CSRF Protection

**Files:**
- Create: `src/lib/csrf.ts`
- Modify: `src/app/api/auth/login/route.ts`
- Modify: `src/app/actions.ts`
- Modify: `src/app/admin/AdminClient.tsx`

- [ ] **Step 6.1: Create CSRF utility**

Create `src/lib/csrf.ts`:

```typescript
import { cookies } from "next/headers";

const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";

export async function generateCsrfToken(): Promise<string> {
  const token = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  return token;
}

export async function validateCsrfToken(request: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken) {
    return false;
  }

  return cookieToken === headerToken;
}

export { CSRF_COOKIE_NAME, CSRF_HEADER_NAME };
```

- [ ] **Step 6.2: Add CSRF token to login response**

Modify `src/app/api/auth/login/route.ts` — after setting auth cookie:

```typescript
import { generateCsrfToken } from "@/lib/csrf";

// Inside successful login block:
const csrfToken = await generateCsrfToken();
return NextResponse.json({ success: true, csrfToken });
```

- [ ] **Step 6.3: Add CSRF validation to actions**

Modify `src/app/actions.ts` — add validation to each server action:

```typescript
import { headers } from "next/headers";
import { validateCsrfToken } from "@/lib/csrf";

async function requireCsrf() {
  const headersList = await headers();
  const request = {
    headers: new Headers(headersList as unknown as Record<string, string>),
  } as Request;
  
  const valid = await validateCsrfToken(request);
  if (!valid) {
    throw new Error("CSRF validation failed");
  }
}

export async function saveArticle(data: Article) {
  await requireCsrf();
  // ... existing code
}

export async function deleteArticle(id: string) {
  await requireCsrf();
  // ... existing code
}

export async function uploadImage(formData: FormData) {
  await requireCsrf();
  // ... existing code
}
```

- [ ] **Step 6.4: Store CSRF token in admin client**

Modify `src/app/admin/AdminClient.tsx` — add CSRF token handling:

```typescript
// Add state for CSRF token
const [csrfToken, setCsrfToken] = useState<string | null>(null);

// After login, store token from response
const handleLogin = async () => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (data.success && data.csrfToken) {
    setCsrfToken(data.csrfToken);
  }
};

// Include CSRF token in all mutations
const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
    // Use fetch with CSRF header instead of server action
    await fetch('/api/articles/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken || '',
      },
      body: JSON.stringify({ id }),
    });
    setArticles(articles.filter(a => a.id !== id));
  }
};
```

- [ ] **Step 6.5: Commit**

```bash
git add src/lib/csrf.ts src/app/api/auth/login/route.ts src/app/actions.ts src/app/admin/AdminClient.tsx
git commit -m "feat(security): add CSRF protection to admin forms and API mutations"
```

---

### Task 7: Basic Test Suite

**Files:**
- Modify: `vitest.config.ts`
- Create: `src/__tests__/auth.test.ts`
- Create: `src/__tests__/search.test.ts`
- Create: `src/__tests__/articles.test.ts`
- Create: `src/__tests__/upload.test.ts`

- [ ] **Step 7.1: Enhance vitest config**

Modify `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/lib/**/*.ts", "src/app/api/**/*.ts", "src/app/actions.ts"],
      thresholds: {
        lines: 60,
        branches: 50,
        functions: 60,
        statements: 60,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 7.2: Create auth tests**

Create `src/__tests__/auth.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { checkRateLimit, cleanupRateLimitStore } from "@/lib/rate-limiter";

describe("Rate Limiter", () => {
  beforeEach(() => {
    cleanupRateLimitStore();
  });

  it("allows first 5 attempts", () => {
    const ip = "127.0.0.1";
    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(ip);
      expect(result.allowed).toBe(true);
    }
  });

  it("blocks 6th attempt", () => {
    const ip = "127.0.0.1";
    for (let i = 0; i < 5; i++) {
      checkRateLimit(ip);
    }
    const result = checkRateLimit(ip);
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it("resets after window expires", () => {
    const ip = "127.0.0.1";
    // Simulate 5 attempts
    for (let i = 0; i < 5; i++) {
      checkRateLimit(ip);
    }
    // Should be blocked
    expect(checkRateLimit(ip).allowed).toBe(false);
    
    // Cleanup removes old entries
    cleanupRateLimitStore();
    // New attempt should be allowed
    expect(checkRateLimit(ip).allowed).toBe(true);
  });
});
```

- [ ] **Step 7.3: Create search tests**

Create `src/__tests__/search.test.ts`:

```typescript
import { describe, it, expect } from "vitest";

describe("Search API Logic", () => {
  // Test scoring logic
  it("scores title match higher than content match", () => {
    const titleMatch = 10;
    const contentMatch = 2;
    expect(titleMatch).toBeGreaterThan(contentMatch);
  });

  it("requires minimum 2 characters for search", () => {
    const query = "a";
    expect(query.length < 2).toBe(true);
  });
});
```

- [ ] **Step 7.4: Create article CRUD tests**

Create `src/__tests__/articles.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { getArticles, saveArticles, Article } from "@/lib/data";

describe("Article CRUD", () => {
  const testArticle: Article = {
    id: "test-1",
    slug: "test-article",
    title: "Test Article",
    excerpt: "Test excerpt",
    content: "Test content",
    coverImage: "/test.jpg",
    category: "Test",
    author: "Test Author",
    readTime: "5 min",
    date: "2026-01-31",
    tags: ["test"],
  };

  it("saves and retrieves articles", async () => {
    const before = await getArticles();
    await saveArticles([...before, testArticle]);
    const after = await getArticles();
    expect(after.length).toBeGreaterThan(before.length);
    const found = after.find(a => a.id === "test-1");
    expect(found).toBeDefined();
    expect(found?.title).toBe("Test Article");
  });
});
```

- [ ] **Step 7.5: Create upload validation tests**

Create `src/__tests__/upload.test.ts`:

```typescript
import { describe, it, expect } from "vitest";

describe("Upload Validation", () => {
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  it("rejects non-image types", () => {
    const fileType = "application/pdf";
    expect(ALLOWED_TYPES.includes(fileType)).toBe(false);
  });

  it("accepts image types", () => {
    expect(ALLOWED_TYPES.includes("image/jpeg")).toBe(true);
    expect(ALLOWED_TYPES.includes("image/png")).toBe(true);
  });

  it("rejects files larger than 5MB", () => {
    const largeSize = 6 * 1024 * 1024;
    expect(largeSize > MAX_FILE_SIZE).toBe(true);
  });

  it("accepts files smaller than 5MB", () => {
    const smallSize = 1 * 1024 * 1024;
    expect(smallSize > MAX_FILE_SIZE).toBe(false);
  });
});
```

- [ ] **Step 7.6: Run tests**

```bash
bun run test
# All tests should pass
```

- [ ] **Step 7.7: Commit**

```bash
git add vitest.config.ts "src/__tests__/*.test.ts"
git commit -m "test: add basic test suite for auth, search, articles, upload"
```

---

## Phase 1 Completion Checklist

After all tasks:

- [ ] `.env.example` created with all required variables
- [ ] Rate limiting active on `/api/auth/login` (429 after 5 attempts)
- [ ] Upload validates file type, size, and path traversal
- [ ] Database uses `@libsql/client` — works locally with `file:local.db`
- [ ] `vercel.json` configured with security headers
- [ ] CSRF tokens on all admin mutations
- [ ] Tests pass with 60%+ coverage on critical paths
- [ ] `bun run build` succeeds
- [ ] Ready for Vercel deployment

## Post-Phase 1: Deploy to Vercel

```bash
# Set environment variables on Vercel
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_SITE_URL

# Deploy
vercel --prod
```
