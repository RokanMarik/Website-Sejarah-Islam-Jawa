import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/data";

export default function ScientificArticleCard({ article }: { article: Article }) {
  const refCount = article.references?.length || 0;

  return (
    <article className="group flex flex-col bg-neutral-950/50 border border-gray-800 hover:border-yellow-400/50 transition-colors">
      {/* Cover Image */}
      <Link href={`/article/${article.slug}`} className="relative aspect-[4/3] overflow-hidden border-b border-gray-800">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover grayscale mix-blend-luminosity opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-yellow-400/90 text-black text-[10px] font-bold uppercase tracking-widest">
            📖 Ilmiah
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/article/${article.slug}`}>
          <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 leading-snug mb-1 transition-colors font-serif">
            {article.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
          oleh {article.author}
        </p>
        <p className="text-gray-400 text-sm font-serif line-clamp-3 mb-4 leading-relaxed flex-grow">
          {article.excerpt}
        </p>
        <div className="flex items-center text-xs text-gray-600 uppercase tracking-wider gap-3">
          <span className="text-yellow-600">{refCount} referensi</span>
          <span className="text-gray-700">◆</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </article>
  );
}
