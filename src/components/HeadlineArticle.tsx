import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/data";

export default function HeadlineArticle({ article }: { article: Article }) {
  return (
    <article className="group relative w-full overflow-hidden border-2 border-gray-800 hover:border-yellow-400 transition-colors bg-black h-[400px] md:h-[600px]">
      <Image
        src={article.coverImage}
        alt={article.title}
        fill
        sizes="(max-width: 768px) 100vw, 80vw"
        className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-1000 ease-in-out grayscale group-hover:grayscale-0 mix-blend-luminosity"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-4/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-yellow-400"></div>
          <span className="text-yellow-400 text-xs font-bold uppercase tracking-[0.2em] font-sans">
            {article.category}
          </span>
        </div>
        <Link href={`/article/${article.slug}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 mb-6 leading-[1.1] font-serif group-hover:text-yellow-300 transition-colors drop-shadow-lg">
            {article.title}
          </h2>
        </Link>
        <p className="text-gray-300 font-serif md:text-xl line-clamp-2 mb-6 max-w-3xl leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-4 text-xs font-sans text-gray-500 uppercase tracking-wider">
          <span>{article.author}</span>
          <span className="text-yellow-600">◆</span>
          <span>{article.date}</span>
        </div>
      </div>
    </article>
  );
}
