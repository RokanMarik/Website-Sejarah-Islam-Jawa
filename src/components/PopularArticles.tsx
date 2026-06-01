"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  date: string;
}

export default function PopularArticles({ articles }: { articles: Article[] }) {
  const [popular, setPopular] = useState<Article[]>([]);

  useEffect(() => {
    const views: Record<string, number> = JSON.parse(localStorage.getItem("page-views") || "{}");
    
    const scored = articles.map(article => {
      const path = `/article/${article.slug}`;
      return { ...article, viewCount: views[path] || 0 };
    });

    const sorted = scored
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 3)
      .filter(a => a.viewCount > 0);

    // If no views yet, show recent articles
    setPopular(sorted.length > 0 ? sorted : articles.slice(0, 3));
  }, [articles]);

  if (popular.length === 0) return null;

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-yellow-400 font-serif mb-10 text-center uppercase tracking-widest">
          Artikel Populer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popular.map((article, i) => (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              className="group block bg-neutral-900 border border-gray-800 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  #{i + 1} Populer
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs text-yellow-600 uppercase tracking-widest mb-2">{article.category}</div>
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors font-serif line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-xs mt-2 line-clamp-2">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
