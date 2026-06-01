'use client';

import { useEffect } from 'react';
import { addToHistory } from '@/lib/bookmarks';

export default function ReadingTracker({ slug, title }: { slug: string; title: string }) {
  useEffect(() => {
    addToHistory({ slug, title });
  }, [slug, title]);

  return null;
}
