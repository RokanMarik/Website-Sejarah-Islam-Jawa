# UI/UX Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up navigation (remove redundant Beranda), consolidate search to single modal, restructure footer with 3-column layout and remove newsletter.

**Architecture:** Pure CSS/layout changes across Navigation.tsx and layout.tsx. No API, DB, or new dependencies.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, TypeScript

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/Navigation.tsx` | Modify | Remove "Beranda" link, remove SearchBar import/usage, narrow dropdown to w-[420px] |
| `src/app/layout.tsx` | Modify | Remove NewsletterForm import/usage, restructure footer to 3-col/stack layout |
| `src/components/SearchBar.tsx` | Keep | File stays (not deleted), just removed from nav |
| `src/components/NewsletterForm.tsx` | Keep | File stays (not deleted), just removed from footer |

---

### Task 1: Clean Up Navigation — Remove Beranda, SearchBar, Narrow Dropdown

**Files:**
- Modify: `src/components/Navigation.tsx`

- [ ] **Step 1: Remove SearchBar import and "Beranda" link**

Remove these lines from Navigation.tsx:
```tsx
// Remove this import
import SearchBar from "./SearchBar";
```

Remove the "Beranda" link from the nav:
```tsx
// REMOVE this line from the <nav> block:
<Link href="/" className="hover:text-yellow-400 transition-colors h-full flex items-center">Beranda</Link>
```

Also remove the `<SearchBar />` usage (keep `<SearchTrigger />` which is the icon-based search):
```tsx
// REMOVE this line:
<SearchBar />
```

The nav section should now look like:
```tsx
<nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-300 uppercase tracking-widest h-full relative" aria-label="Navigasi utama">
  {/* Hierarchical Dropdown Menu */}
  <div 
    className="h-full flex items-center relative group"
    onMouseEnter={() => setActiveDropdown("kerajaan")}
    onMouseLeave={() => setActiveDropdown(null)}
  >
    <button className="hover:text-yellow-400 transition-colors flex items-center gap-1 uppercase tracking-widest text-yellow-400 border-b-2 border-yellow-400 h-full">
      Kerajaan Islam Pedalaman Jawa
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
    </button>
    
    {activeDropdown === "kerajaan" && (
      <div className="absolute top-20 left-0 w-[420px] bg-black border-2 border-yellow-400 p-6 grid grid-cols-3 gap-6 shadow-2xl z-50 mega-menu">
        {menus.map((menu) => (
          <div key={menu.title}>
            <h4 className="text-yellow-400 font-bold mb-4 pb-2 border-b border-gray-800 text-lg font-serif">{menu.title}</h4>
            <ul className="space-y-3">
              {menu.submenus.map(sub => (
                <li key={sub}>
                  <Link href={`/kategori/${menu.title.toLowerCase()}/${sub.toLowerCase()}`} className="text-gray-300 hover:text-white hover:underline text-xs tracking-wider transition-all">
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
  
  <Link href="/silsilah" className="hover:text-yellow-400 transition-colors h-full flex items-center">Silsilah</Link>
  <Link href="/kamus" className="hover:text-yellow-400 transition-colors h-full flex items-center">Kamus</Link>
  <Link href="/kuis" className="hover:text-yellow-400 transition-colors h-full flex items-center">Kuis</Link>
  
  <SearchTrigger />
  <Link href="/bookmarks" className="hover:text-yellow-400 transition-colors h-full flex items-center" aria-label="Bookmark">
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
  </Link>
  <ThemeToggle />
</nav>
```

Key changes:
- `w-[600px]` → `w-[420px]` on the dropdown
- Removed `SearchBar` import and usage
- Removed "Beranda" Link

- [ ] **Step 2: Verify build passes**

Run: `cd Website-Sejarah-Islam-Jawa && bun run build`
Expected: Build succeeds (may take 30-60s)

- [ ] **Step 3: Commit**

```bash
cd Website-Sejarah-Islam-Jawa
git add src/components/Navigation.tsx
git commit -m "feat(nav): remove Beranda link, consolidate search, narrow dropdown"
```

---

### Task 2: Restructure Footer — Remove Newsletter, 3-Column Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Remove NewsletterForm import and footer newsletter section**

Remove this import:
```tsx
import NewsletterForm from "@/components/NewsletterForm";
```

Remove this section from the footer:
```tsx
{/* Newsletter */}
<div className="w-full max-w-md text-center mb-4">
  <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-3">Newsletter</h3>
  <NewsletterForm />
</div>
```

- [ ] **Step 2: Replace footer with new 3-column layout**

Replace the entire `<footer>` block with:

```tsx
<footer className="bg-black text-gray-500 py-16 border-t border-gray-800 mt-20 transition-colors duration-1000">
  <div className="max-w-5xl mx-auto px-4 lg:px-8">
    {/* Desktop: 3 columns | Mobile: stack */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
      {/* Column 1: About */}
      <div className="space-y-4">
        <div className="text-2xl font-bold tracking-widest text-white uppercase font-serif">
          Nusa<span className="text-yellow-400">Historia</span>
        </div>
        <div className="space-y-2 text-sm">
          <a href="/tentang" className="block hover:text-yellow-400 transition-colors">Tentang</a>
          <a href="/kontak" className="block hover:text-yellow-400 transition-colors">Kontak</a>
          <a href="https://www.instagram.com/rokanakbar14/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            Instagram
          </a>
        </div>
      </div>

      {/* Column 2: Navigation */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-widest">Navigasi</h3>
        <div className="space-y-2 text-sm">
          <a href="/" className="block hover:text-yellow-400 transition-colors">Beranda</a>
          <a href="/kamus" className="block hover:text-yellow-400 transition-colors">Kamus</a>
          <a href="/kuis" className="block hover:text-yellow-400 transition-colors">Kuis</a>
        </div>
      </div>

      {/* Column 3: Support */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-widest">Dukung Kami</h3>
        <div className="space-y-2 text-sm">
          <a href="https://saweria.co/KalaKata" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
            Traktir kopi redaksi
          </a>
          <p className="text-gray-600 text-xs">Dukung kami membuat konten sejarah yang berkualitas.</p>
        </div>
      </div>
    </div>

    {/* Divider */}
    <div className="w-24 h-1 bg-yellow-400 my-8"></div>

    {/* Copyright */}
    <div className="text-xs uppercase tracking-widest text-center">© {new Date().getFullYear()} Kerajaan Islam Pedalaman Jawa</div>
  </div>
</footer>
```

Key changes:
- `py-12` → `py-16` (more vertical padding)
- `max-w-7xl` → `max-w-5xl` (narrower content)
- Newsletter removed
- 3-column grid on desktop (`md:grid-cols-3`), stack on mobile
- Saweria link in dedicated column

- [ ] **Step 3: Verify build passes**

Run: `cd Website-Sejarah-Islam-Jawa && bun run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
cd Website-Sejarah-Islam-Jawa
git add src/app/layout.tsx
git commit -m "feat(footer): 3-column layout, remove newsletter, add Saweria support"
```

---

### Task 3: Final Verification

**Files:**
- All modified files

- [ ] **Step 1: Run full build**

Run: `cd Website-Sejarah-Islam-Jawa && bun run build`
Expected: No errors, no warnings related to our changes

- [ ] **Step 2: Run lint**

Run: `cd Website-Sejarah-Islam-Jawa && bun run lint`
Expected: No lint errors

- [ ] **Step 3: Verify responsive behavior (manual check)**

Open dev tools and check:
- Mobile (320px): Footer stacks vertically, nav shows hamburger
- Tablet (768px): Footer shows 3 columns, nav shows horizontal links
- Desktop (1280px+): Everything spacious, dropdown at 420px width

- [ ] **Step 4: Final commit with tag**

```bash
cd Website-Sejarah-Islam-Jawa
git log --oneline -3
```

Verify last 3 commits are:
1. `feat(nav): remove Beranda link, consolidate search, narrow dropdown`
2. `feat(footer): 3-column layout, remove newsletter, add Saweria support`
3. `docs: add UI/UX cleanup design spec (nav, search, footer)`
