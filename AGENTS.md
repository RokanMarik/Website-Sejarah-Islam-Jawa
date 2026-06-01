<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Vibecoding Rules

## Workflow

1. **Read first** — Always check `docs/` and existing code before implementing
2. **Plan briefly** — One paragraph, not a spec. Share it before coding.
3. **Build the happy path** — Make it work, then handle edge cases
4. **Test as you go** — Run `bun dev` and check the page after each meaningful change
5. **Polish last** — Clean up, add comments, write tests after it works

## Stack Conventions

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | libsql (local.db) |
| Animations | Framer Motion |
| Runtime | Bun |

## Code Rules

- **Component files**: One component per file, named export
- **Server vs Client**: Default to Server Components. Use `'use client'` only when needed (state, effects, browser APIs)
- **Data fetching**: Server components fetch directly. Client components use Server Actions or API routes
- **Styling**: Tailwind utility classes. No CSS modules unless unavoidable
- **Types**: No `any`. Use `unknown` if type is truly unknown, then narrow
- **Imports**: Use `@/` alias for src imports. Group: react → next → external → internal
- **Database**: Use `@libsql/client`. All DB ops go through `src/lib/db.ts`

## File Structure

```
src/
├── app/              # Next.js App Router pages & layouts
├── components/       # Reusable UI components
├── lib/              # Utilities, DB client, helpers
├── types/            # Shared TypeScript types
└── styles/           # Global styles (minimal)
```

## Before Committing

- [ ] `bun run lint` passes
- [ ] Page renders without console errors
- [ ] No `any` types introduced
- [ ] Database queries use parameterized inputs
- [ ] No secrets or API keys in code

## Safety

- **Never** commit `local.db` or `.env` files
- **Never** hardcode API keys — use environment variables
- **Always** sanitize user input before DB queries
- **Always** validate Server Action inputs with Zod or similar
