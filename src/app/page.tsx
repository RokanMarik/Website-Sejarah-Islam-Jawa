import { getArticles } from "@/lib/data";
import HeadlineArticle from "@/components/HeadlineArticle";
import GridArticle from "@/components/GridArticle";
import Sidebar from "@/components/Sidebar";
import Ornament from "@/components/Ornament";
import JavaMap from "@/components/JavaMap";
import Timeline from "@/components/Timeline";
import PopularArticles from "@/components/PopularArticles";

export default async function Home() {
  const articles = getArticles();
  const headlineArticle = articles.find(a => a.isHeadline) || articles[0];
  const gridArticles = articles.filter(a => a.id !== headlineArticle.id);

  return (
    <div className="bg-transparent pb-20 relative overflow-hidden">
      {/* Container for Headline */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-12 mb-16 relative z-10">
        <div className="border-b-2 border-yellow-500 pb-4 mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-black uppercase tracking-widest text-yellow-400 font-serif">Utama</h1>
          <div className="h-1 w-32 bg-yellow-400"></div>
        </div>
        {headlineArticle && <HeadlineArticle article={headlineArticle} />}
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Feed */}
          <div className="w-full lg:w-2/3">
            <div className="border-b border-gray-800 pb-3 mb-8 flex items-center">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-white font-serif">Arsip Sejarah</h2>
              <div className="ml-4 h-[1px] flex-grow bg-gray-800"></div>
            </div>
            
            {/* Interactive Modules */}
            <div className="w-full">
              <JavaMap />
            </div>
            
            <div className="w-full">
              <Timeline />
            </div>

            <div className="flex flex-col lg:flex-row gap-12 mt-8">
              <div className="w-full lg:w-2/3 flex flex-col gap-8">
                {gridArticles.map(article => (
                  <GridArticle key={article.id} article={article} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
            <Sidebar />
          </div>

        </div>
      </div>

      {/* Popular Articles */}
      <PopularArticles articles={articles} />
      
      {/* JSON-LD ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Artikel Sejarah Islam Jawa",
            itemListElement: articles.slice(0, 10).map((article, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Article",
                url: `https://nusahistoria.com/article/${article.slug}`,
                name: article.title,
                description: article.excerpt,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
