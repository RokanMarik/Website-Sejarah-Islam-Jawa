'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBookmarks, removeBookmark, Bookmark } from "@/lib/bookmarks";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const handleRemove = (id: string) => {
    removeBookmark(id);
    setBookmarks(getBookmarks());
  };

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-12">
        <h1 className="text-4xl font-black uppercase tracking-widest text-yellow-400 font-serif mb-8">Bookmark</h1>

        {bookmarks.length === 0 ? (
          <p className="text-gray-400">Belum ada artikel yang di-bookmark.</p>
        ) : (
          <div className="grid gap-6">
            {bookmarks.map(bookmark => (
              <div key={bookmark.id} className="flex gap-4 p-4 bg-neutral-900 rounded-lg border border-gray-800">
                <Link href={`/article/${bookmark.slug}`} className="flex-shrink-0 w-32 h-20 relative">
                  <Image src={bookmark.coverImage} alt={bookmark.title} fill className="object-cover rounded" />
                </Link>
                <div className="flex-1">
                  <Link href={`/article/${bookmark.slug}`} className="text-white font-bold hover:text-yellow-400">
                    {bookmark.title}
                  </Link>
                  <p className="text-sm text-gray-400 mt-1">{bookmark.category}</p>
                  <button onClick={() => handleRemove(bookmark.id)} className="text-xs text-red-400 hover:text-red-300 mt-2">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
