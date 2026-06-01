'use client';

import { useState, useEffect } from "react";
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/bookmarks";
import { Article } from "@/lib/data";

export default function BookmarkButton({ article }: { article: Article }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(article.id));
  }, [article.id]);

  const toggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark({
        id: article.id,
        slug: article.slug,
        title: article.title,
        coverImage: article.coverImage,
        category: article.category,
        dateAdded: new Date().toISOString(),
      });
    }
    setBookmarked(!bookmarked);
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`p-2 rounded-full transition-colors ${
        bookmarked ? "text-yellow-400 hover:text-yellow-300" : "text-gray-400 hover:text-white"
      }`}
      aria-label={bookmarked ? "Hapus bookmark" : "Tambah bookmark"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}
