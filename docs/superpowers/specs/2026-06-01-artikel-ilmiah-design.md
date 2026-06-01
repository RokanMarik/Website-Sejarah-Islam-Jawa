# Artikel Ilmiah Populer — Design Spec

**Date:** 2026-06-01
**Status:** Approved
**Author:** Sri Baginda

## Problem

NusaHistoria butuh section untuk artikel populer ilmiah — artikel well-researched yang sering dikutip media, tapi tetap readable untuk umum (kaya artikel di Majalah Tempo atau Historica).

## Design Decisions

### 1. Data Model — Field `type`

Tambah field `type` dan `references` di Article model:

```typescript
interface Article {
  // ... existing fields
  type: 'regular' | 'scientific'  // default: 'regular'
  references?: string[]            // list referensi, format: "Author. (Tahun). Judul. Publisher."
}
```

**Database changes:**
- Tambah kolom `type` (TEXT, default 'regular')
- Tambah kolom `references` (TEXT/JSON array)

### 2. Homepage — Section "Bacaan Ilmiah"

Section baru di homepage, muncul setelah "Arsip Sejarah", sebelum "Popular Articles".

**Layout:** 3-card grid (sama kayak section lainnya), max 3 artikel terbaru.

**Card ilmiah (beda dari card biasa):**
```
┌───────────────┐
│  [Cover img]  │
│               │
│  📖 Ilmiah    │  ← badge di atas judul
│               │
│  Judul Artikel│
│  oleh Ahmad F │  ← author di bawah judul
│               │
│  Excerpt yang │  ← 3 baris (lebih panjang dari biasa)
│  lebih panjang│
│  ...          │
│               │
│  5 ref · 15m  │  ← jumlah referensi + read time
└───────────────┘
```

**Perbedaan card ilmiah vs biasa:**
| Aspect | Biasa | Ilmiah |
|---|---|---|
| Badge | Ada (nama kategori) | `📖 Ilmiah` |
| Author | Tidak tampil | Di bawah judul |
| Excerpt | 1 baris | 3 baris |
| Meta info | Date · read time | Ref count · read time |

### 3. Artikel Page — Layout + Sticky Sidebar

#### Judul + Author

```
Judul Artikel yang Panjang
oleh Ahmad Fauzan
─────────────────────────────────────
20 Mei 2026 · 15 min read
```

Author muncul langsung di bawah judul, sebelum meta info (date, read time).

#### Desktop (≥1024px) — 2 kolom + sticky sidebar

```
┌────────────────────────┬────────────────────┐
│                        │  oleh Ahmad Fauzan │ ← sticky top
│  [Konten artikel...]   │                    │
│                        │  5 referensi       │
│  Paragraf 1...         │                    │
│                        │  Bagikan:          │
│  Paragraf 2...         │  [Twitter] [FB]    │
│                        │                    │
│  ...                   │  ───────────────   │
│                        │                    │
│  (scroll continues)    │  📚 Daftar         │
│                        │     Referensi      │
│                        │  1. Kuntowijoyo... │
│                        │  2. Ricklefs...    │
│                        │  3. Carey...       │
└────────────────────────┴────────────────────┘
```

**Sticky sidebar berisi:**
- Author name (sticky, selalu terlihat pas scroll)
- Jumlah referensi
- Share buttons
- Daftar Referensi (muncul di sidebar juga, biar gampang dilihat)

#### Mobile (<1024px) — Single column

```
┌────────────────────────────┐
│  Judul Artikel             │
│  oleh Ahmad Fauzan         │
│  ─────────────────────     │
│  20 Mei 2026 · 15 min read │
│                            │
│  [Konten artikel...]       │
│                            │
│  ...                       │
│                            │
│  ─────────────────────     │
│  📚 Daftar Referensi       │
│  1. Kuntowijoyo...         │
│  2. Ricklefs...            │
│  3. Carey...               │
└────────────────────────────┘
```

Mobile: author info di bawah judul, referensi di bawah konten (no sidebar).

### 4. Referensi — Simple List Format

```
📚 Daftar Referensi
──────────────────────────────────
1. Kuntowijoyo. (2002). Pengantar Ilmu
   Sejarah. Yogyakarta: Penerbit Ombak.

2. Ricklefs, M.C. (2005). Sejarah
   Indonesia Modern. Jakarta: UGM Press.

3. Carey, P. (1981). Babad Dipanagara.
   The Hague: Martinus Nijhoff.
```

Format: numbered list, gaya akademik tapi readable. Satu referensi = satu baris (bisa wrap kalo panjang).

### 5. Admin — Input Referensi

Di halaman admin (AdminClient.tsx), tambah section "Referensi" yang muncul kalo type = "scientific":

```
┌──────────────────────────────────────┐
│ Tipe Artikel:  [● Ilmiah] [○ Biasa]  │
├──────────────────────────────────────┤
│ Referensi (satu per baris):          │
│ ┌──────────────────────────────────┐ │
│ │ 1. Kuntowijoyo. (2002)...       │ │
│ │ 2. Ricklefs, M.C. (2005)...     │ │
│ │ 3. Carey, P. (1981)...          │ │
│ └──────────────────────────────────┘ │
│ [+ Tambah Referensi]                 │
└──────────────────────────────────────┘
```

## Files to Modify

| File | Change |
|---|---|
| `src/lib/data.ts` | Tambah `type`, `references` di Article interface |
| `src/lib/db.ts` | Migration: tambah kolom `type`, `references` |
| `src/app/page.tsx` | Tambah section "Bacaan Ilmiah" |
| `src/components/GridArticle.tsx` | Tambah variant card ilmiah |
| `src/app/article/[slug]/page.tsx` | Layout 2 kolom + sticky sidebar (desktop), referensi di bawah |
| `src/app/admin/AdminClient.tsx` | Input type + referensi |

## Implementation Notes

- Sticky sidebar: `position: sticky` + `top: 6rem` (di bawah nav)
- Card ilmiah: conditional styling berdasarkan `article.type === 'scientific'`
- Referensi: simpan sebagai JSON array di DB, render sebagai ordered list
- Mobile: sidebar jadi inline di bawah konten (responsive)
- Section "Bacaan Ilmiah": filter `WHERE type = 'scientific' ORDER BY created_at DESC LIMIT 3`

## Success Criteria

- [ ] Field `type` dan `references` ada di Article model dan DB
- [ ] Section "Bacaan Ilmiah" muncul di homepage (3 artikel terbaru)
- [ ] Card ilmiah beda dari card biasa (badge, author, excerpt, ref count)
- [ ] Author muncul di bawah judul artikel
- [ ] Sticky sidebar di desktop (author + referensi)
- [ ] Referensi tampil sebagai numbered list di bawah konten
- [ ] Admin bisa pilih type dan input referensi
- [ ] Mobile: single column, no sidebar, referensi inline di bawah
- [ ] No layout shift dari sticky element
