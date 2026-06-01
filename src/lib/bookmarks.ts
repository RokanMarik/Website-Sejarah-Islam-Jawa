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
  const filtered = history.filter(h => h.slug !== article.slug);
  filtered.unshift({ ...article, dateViewed: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, MAX_HISTORY)));
}
