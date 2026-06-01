import Link from "next/link";
import { getArticles } from "@/lib/data";

export default async function Sidebar() {
  const articles = await getArticles();
  const popularArticles = articles.slice(1, 3);

  return (
    <aside className="w-full">
      {/* "Terpopuler" Block styled like the user's image */}
      <div className="mb-12 border-2 border-yellow-400 relative overflow-hidden bg-black shadow-lg shadow-yellow-500/10">
        {/* Yellow top half */}
        <div className="bg-yellow-400 h-20 relative w-full flex items-center justify-end px-6">
          <h3 className="text-2xl font-black uppercase tracking-widest text-black font-serif z-20">
            TERPOPULER
          </h3>
        </div>
        
        {/* Black bottom half for content */}
        <div className="p-6 bg-black relative z-20 pt-8">
          <div className="flex flex-col gap-6">
            {popularArticles.map((article, index) => (
              <Link href={`/article/${article.slug}`} key={article.id} className="group flex gap-4 items-start border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                <span className="text-4xl font-black text-gray-800 group-hover:text-yellow-400 transition-colors font-serif w-6 text-center leading-none">
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-base font-bold text-gray-200 group-hover:text-yellow-400 leading-tight mb-2 transition-colors font-serif">
                    {article.title}
                  </h4>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">{article.date}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Kuis Sejarah Block */}
      <div className="border border-yellow-500 p-8 mb-8 relative overflow-hidden bg-neutral-900 group hover:border-yellow-400 transition-colors">
        <div className="absolute -top-10 -right-10 text-gray-800 opacity-20 group-hover:text-yellow-900 transition-colors">
          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"></path></svg>
        </div>
        <h3 className="text-xl font-black mb-3 text-yellow-400 font-serif uppercase tracking-widest relative z-10">Uji Wawasan</h3>
        <p className="text-sm text-gray-400 mb-6 font-serif relative z-10 leading-relaxed">Seberapa jauh Anda mengenal sejarah pedalaman Jawa?</p>
        <Link href="/kuis" className="block w-full text-center bg-transparent border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-bold py-3 px-4 transition-all font-sans uppercase tracking-widest text-sm relative z-10">
          Mulai Kuis Interaktif
        </Link>
      </div>
    </aside>
  );
}
