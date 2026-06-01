"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import articlesData from "@/lib/data.json";
import { useRouter } from "next/navigation";

interface Article {
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

interface SearchResult extends Article {
  matchType: "title" | "excerpt" | "category" | "tags";
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setAllArticles(articlesData as Article[]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const matched: SearchResult[] = [];

    for (const article of allArticles) {
      const titleMatch = article.title.toLowerCase().includes(lowerQuery);
      const excerptMatch = article.excerpt.toLowerCase().includes(lowerQuery);
      const categoryMatch = article.category.toLowerCase().includes(lowerQuery);
      const tagsMatch = article.tags?.some(t => t.toLowerCase().includes(lowerQuery));

      if (titleMatch || excerptMatch || categoryMatch || tagsMatch) {
        matched.push({
          ...article,
          matchType: titleMatch ? "title" : excerptMatch ? "excerpt" : categoryMatch ? "category" : "tags",
        });
      }
    }

    setResults(matched);
    setIsOpen(true);
  }, [query, allArticles]);

  return (
    <div ref={searchRef} className="relative">
      <div className="flex items-center gap-2 bg-neutral-900 border border-gray-700 rounded-full px-4 py-2 focus-within:border-yellow-400 transition-colors">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari artikel..."
          className="bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none w-32 md:w-48"
          aria-label="Search articles"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-gray-500 hover:text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-80 bg-black border-2 border-yellow-400 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {results.slice(0, 5).map((result) => (
              <Link
                key={result.id}
                href={`/article/${result.slug}`}
                className="block p-3 hover:bg-neutral-900 rounded transition-colors"
                onClick={() => { setQuery(""); setIsOpen(false); }}
              >
                <div className="text-xs text-yellow-500 uppercase tracking-wider mb-1">{result.category}</div>
                <div className="text-sm font-bold text-white font-serif">{result.title}</div>
                <div className="text-xs text-gray-400 line-clamp-1 mt-1">{result.excerpt}</div>
              </Link>
            ))}
            {results.length > 5 && (
              <button
                onClick={() => {
                  router.push(`/pencarian?q=${encodeURIComponent(query)}`);
                  setQuery("");
                  setIsOpen(false);
                }}
                className="w-full text-center py-3 text-sm text-yellow-400 hover:text-yellow-300 border-t border-gray-800 font-bold uppercase tracking-wider"
              >
                Lihat semua {results.length} hasil →
              </button>
            )}
          </div>
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-2 w-80 bg-black border-2 border-yellow-400 rounded-lg shadow-2xl z-50 p-6 text-center">
          <div className="text-gray-400 text-sm">Tidak ada hasil untuk &quot;{query}&quot;</div>
        </div>
      )}
    </div>
  );
}
