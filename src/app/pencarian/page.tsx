"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  date: string;
  score: number;
  snippet: string;
  matchType: string;
}

function SearchResultsInner() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q.length < 2) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results);
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setLoading(false);
      }
    };

    // Save to recent searches
    const recent = JSON.parse(localStorage.getItem("recent-searches") || "[]");
    const filtered = recent.filter((s: string) => s !== q);
    filtered.unshift(q);
    localStorage.setItem("recent-searches", JSON.stringify(filtered.slice(0, 5)));

    fetchResults();
  }, [q]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-neutral-900 p-6 rounded-xl space-y-3">
                <div className="h-6 bg-gray-800 rounded w-2/3" />
                <div className="h-4 bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (q.length < 2) {
    return (
      <div className="min-h-screen bg-black text-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-black text-white font-serif mb-8 uppercase tracking-wider">
            Hasil Pencarian
          </h1>
          <p className="text-gray-500 text-lg">Masukkan minimal 2 karakter untuk mencari.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-black text-white font-serif mb-2 uppercase tracking-wider">
          Hasil Pencarian
        </h1>
        <p className="text-gray-400 mb-8">
          Ditemukan <span className="text-yellow-400 font-bold">{results.length}</span> hasil untuk &quot;{q}&quot;
        </p>

        {results.length > 0 ? (
          <div className="space-y-6">
            {results.map(result => (
              <Link
                key={result.slug}
                href={`/article/${result.slug}`}
                className="block bg-neutral-900 border border-gray-800 p-6 rounded-xl hover:border-yellow-500/50 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs uppercase tracking-widest text-yellow-600 font-bold">{result.category}</span>
                      <span className="text-xs text-gray-600">{result.date}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        result.matchType === "title" ? "bg-yellow-500/20 text-yellow-400" :
                        result.matchType === "excerpt" ? "bg-blue-500/20 text-blue-400" :
                        "bg-gray-500/20 text-gray-400"
                      }`}>
                        {result.matchType === "title" ? "Judul" : result.matchType === "excerpt" ? "Ringkasan" : "Konten"}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors font-serif">
                      {result.title}
                    </h2>
                    <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                      {result.snippet}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-gray-800 rounded-xl">
            <p className="text-gray-500 font-serif text-xl italic">Tidak ada hasil ditemukan.</p>
            <p className="text-gray-600 mt-2">Coba kata kunci lain.</p>
          </div>
        )}

        {/* Recent Searches */}
        <RecentSearches />
      </div>
    </div>
  );
}

function RecentSearches() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(JSON.parse(localStorage.getItem("recent-searches") || "[]"));
  }, []);

  if (recent.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-800">
      <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">Pencarian Terakhir</h3>
      <div className="flex flex-wrap gap-2">
        {recent.map((s, i) => (
          <Link
            key={i}
            href={`/pencarian?q=${encodeURIComponent(s)}`}
            className="px-3 py-1.5 bg-neutral-900 border border-gray-700 rounded-full text-sm text-gray-400 hover:text-yellow-400 hover:border-yellow-400 transition-colors"
          >
            {s}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResultsInner />
    </Suspense>
  );
}
