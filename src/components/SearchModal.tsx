'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  score: number;
  snippet: string;
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? onClose() : document.getElementById("search-trigger")?.click();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results?.slice(0, 8) || []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center border-b border-gray-700">
          <svg className="w-5 h-5 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari artikel sejarah..."
            className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-4 outline-none"
          />
          <kbd className="mr-4 px-2 py-1 text-xs text-gray-400 bg-gray-800 rounded">ESC</kbd>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-gray-400">Mencari...</div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="p-4 text-center text-gray-400">Tidak ada hasil ditemukan.</div>
          )}

          {!loading && results.map(result => (
            <Link
              key={result.id}
              href={`/article/${result.slug}`}
              onClick={onClose}
              className="flex gap-4 p-4 hover:bg-neutral-800 border-b border-gray-800 transition-colors"
            >
              <div className="flex-1">
                <h4 className="text-white font-bold hover:text-yellow-400">{result.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{result.category}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{result.snippet}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="px-4 py-2 bg-neutral-950 text-xs text-gray-500 border-t border-gray-800">
          Tekan <kbd className="px-1 py-0.5 bg-gray-800 rounded">Enter</kbd> untuk membuka, <kbd className="px-1 py-0.5 bg-gray-800 rounded">ESC</kbd> untuk tutup
        </div>
      </div>
    </div>
  );
}
