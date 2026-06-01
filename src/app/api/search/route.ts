import { NextRequest, NextResponse } from "next/server";
import { getArticles } from "@/lib/data";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  
  if (query.length < 2) {
    return NextResponse.json({ results: [], query });
  }

  const articles = getArticles();
  const q = query.toLowerCase();

  const results = articles
    .map(article => {
      const titleMatch = article.title.toLowerCase().includes(q);
      const excerptMatch = article.excerpt.toLowerCase().includes(q);
      const contentMatch = article.content.toLowerCase().includes(q);
      const tagsMatch = article.tags?.some(t => t.toLowerCase().includes(q));
      const categoryMatch = article.category?.toLowerCase().includes(q);

      let score = 0;
      if (titleMatch) score += 10;
      if (excerptMatch) score += 5;
      if (contentMatch) score += 2;
      if (tagsMatch) score += 3;
      if (categoryMatch) score += 3;

      // Find snippet from content
      let snippet = article.excerpt;
      if (contentMatch) {
        const idx = article.content.toLowerCase().indexOf(q);
        if (idx >= 0) {
          const start = Math.max(0, idx - 80);
          const end = Math.min(article.content.length, idx + 120);
          snippet = (start > 0 ? "..." : "") + article.content.slice(start, end) + (end < article.content.length ? "..." : "");
        }
      }

      return {
        ...article,
        score,
        snippet,
        matchType: titleMatch ? "title" : excerptMatch ? "excerpt" : contentMatch ? "content" : "tags",
      };
    })
    .filter(a => a.score > 0)
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({ results, query });
}
