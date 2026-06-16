import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/data";

interface RelatedArticlesProps {
  currentArticle: Article;
  allArticles: Article[];
}

export default function RelatedArticles({ currentArticle, allArticles }: RelatedArticlesProps) {
  const currentTags = currentArticle.tags?.filter(Boolean).map(t => t.toLowerCase()) || [];
  const currentCategory = currentArticle.category.toLowerCase();
  const currentTagsSet = new Set(currentTags);

  const related: (Article & { score: number })[] = [];
  for (const a of allArticles) {
    if (a.id === currentArticle.id) continue;
    let score = 0;
    const articleTags = a.tags?.filter(Boolean).map(t => t.toLowerCase()) || [];
    for (const tag of articleTags) {
      if (currentTagsSet.has(tag)) score += 3;
    }
    if (a.category.toLowerCase() === currentCategory) score += 2;
    if (score > 0) related.push({ ...a, score });
  }
  related.sort((a, b) => b.score - a.score);
  const topRelated = related.slice(0, 4);

  if (topRelated.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-gray-800">
      <h3 className="font-serif font-bold text-2xl text-yellow-400 mb-8">Artikel Terkait</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topRelated.map(article => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group border border-gray-800 hover:border-yellow-400 transition-colors bg-black overflow-hidden"
          >
            <div className="relative w-full h-40">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="p-4">
              <div className="text-xs text-yellow-500 uppercase tracking-wider mb-2">{article.category}</div>
              <h4 className="font-serif font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
                {article.title}
              </h4>
              <div className="text-xs text-gray-500 mt-2 uppercase tracking-wider">{article.date}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
