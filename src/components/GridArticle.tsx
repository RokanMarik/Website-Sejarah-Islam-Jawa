import Link from "next/link";
import { Article } from "@/lib/data";

export default function GridArticle({ article }: { article: Article }) {
  return (
    <article className="group flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-900 font-sans">
      <Link href={`/article/${article.slug}`} className="sm:w-2/5 shrink-0 overflow-hidden border border-gray-800 aspect-[4/3] relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={article.coverImage} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale mix-blend-luminosity opacity-70 group-hover:grayscale-0 group-hover:opacity-100"
        />
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400 transition-colors pointer-events-none"></div>
      </Link>
      
      <div className="sm:w-3/5 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-[1px] bg-yellow-500"></div>
          <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">
            {article.category}
          </span>
        </div>
        <Link href={`/article/${article.slug}`}>
          <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 leading-snug mb-3 transition-colors font-serif">
            {article.title}
          </h3>
        </Link>
        <p className="text-gray-400 text-base font-serif line-clamp-3 mb-4 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center text-xs text-gray-600 uppercase tracking-wider mt-auto">
          <span>{article.date}</span>
          <span className="mx-3 text-yellow-600">◆</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </article>
  );
}
