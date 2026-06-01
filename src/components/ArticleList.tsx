'use client';

import { useState } from "react";
import GridArticle from "@/components/GridArticle";
import { Article } from "@/lib/data";

const ARTICLES_PER_PAGE = 10;

export default function ArticleList({ articles }: { articles: Article[] }) {
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);
  const visibleArticles = articles.slice(0, visibleCount);
  const remaining = articles.length - visibleCount;

  return (
    <>
      <div className="flex flex-col gap-8">
        {visibleArticles.map((article) => (
          <GridArticle key={article.id} article={article} />
        ))}
      </div>

      {remaining > 0 && (
        <button
          onClick={() => setVisibleCount(prev => prev + ARTICLES_PER_PAGE)}
          className="w-full py-3 mt-8 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold uppercase tracking-wider transition-colors rounded-lg"
        >
          Muat Lebih Banyak ({remaining} artikel lagi)
        </button>
      )}
    </>
  );
}
