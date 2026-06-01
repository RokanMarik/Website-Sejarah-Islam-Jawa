# UI/UX Cleanup — Navigation, Search, Footer

**Date:** 2026-06-01
**Status:** Approved
**Author:** Sri Baginda

## Problem

Current UI/UX issues on NusaHistoria:
1. Navigation has redundant "Beranda" link (logo already links to home)
2. Two search components (SearchBar in nav + SearchModal) — redundant
3. Footer is cramped, newsletter form is unnecessary, will break on mobile
4. Dropdown mega-menu too wide (`w-[600px]`) — potential overflow on smaller screens

## Design Decisions

### 1. Navigation — Minimalist

**Change:** Remove "Beranda" link, narrow dropdown, icon-based search toggle.

**Before:**
```
[NusaHistoria] [Beranda] [Kerajaan Islam Pedalaman Jawa ▾] [Kamus] [Kuis] [Kontak] ...
```

**After:**
```
[NusaHistoria] [Kerajaan Islam ▾] [Kamus] [Kuis] [Kontak] [🔍] [🌙] [☰]
```

**Details:**
- "Beranda" removed — logo `NusaHistoria` already links to `/`
- Dropdown width: `w-[600px]` → `w-[420px]` (fits in most viewports)
- Search: text input replaced with icon `🔍` → triggers SearchModal
- Theme toggle: icon `🌙/☀️`
- Mobile: hamburger `☰` (existing MobileMenu, no changes needed)

### 2. Search — Single Component

**Change:** Remove SearchBar from nav, keep only SearchModal.

**Details:**
- Delete `SearchBar` usage in `Navigation.tsx`
- Add search icon button that opens `SearchModal`
- SearchModal already supports `Ctrl+K` shortcut — keep as is
- SearchModal trigger: icon click OR `Ctrl+K` keyboard shortcut

### 3. Footer — Restructured

**Change:** Remove newsletter, add 3-column layout, mobile stack.

**Desktop (≥768px) — 3 columns:**
| Column 1: About | Column 2: Navigation | Column 3: Support |
|---|---|---|
| **NusaHistoria** (text) | Beranda | ☕ Dukung via Saweria |
| Tentang | Kamus | "Traktir kopi redaksi?" |
| Kontak | Kuis | Link: saweria.co/KalaKata |
| Instagram | | |

**Mobile (<768px) — Stack:**
- All links stacked vertically
- Section separators (thin yellow line)
- Spacing: `py-2` per link, `py-4` between sections
- Saweria link prominent with icon

**Removed:**
- Newsletter form (`NewsletterForm` component)
- Email input field
- "Subscribe" text

**Added:**
- `gap-8` between columns (desktop)
- `space-y-4` between sections (mobile)
- `py-16` vertical padding (was `py-12`)
- Max-width constraint on footer content: `max-w-5xl`

## Files to Modify

| File | Change |
|---|---|
| `src/components/Navigation.tsx` | Remove "Beranda", remove SearchBar, add search icon, narrow dropdown |
| `src/components/SearchBar.tsx` | Keep file (may be used elsewhere), remove from nav |
| `src/app/layout.tsx` | Remove NewsletterForm import and usage |
| `src/components/NewsletterForm.tsx` | Keep file (no break), remove from footer |
| Footer in `layout.tsx` | Restructure to 3-col desktop / stack mobile, add Saweria, remove newsletter |

## Implementation Notes

- Use Tailwind responsive prefixes: `md:grid md:grid-cols-3` for footer columns
- Search icon: use Lucide or inline SVG
- Dropdown: keep existing hover logic, just change width
- No new dependencies needed
- All changes are CSS/layout only — no API or DB changes

## Success Criteria

- [ ] "Beranda" link removed from navigation
- [ ] Only 1 search component (SearchModal) visible
- [ ] Footer has 3 columns on desktop, stacked on mobile
- [ ] Newsletter form removed from footer
- [ ] "Dukung via Saweria" link present in footer
- [ ] No layout overflow on 320px viewport
- [ ] No layout shift (CLS) from changes
