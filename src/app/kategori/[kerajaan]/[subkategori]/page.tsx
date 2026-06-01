import { getArticles } from "@/lib/data";
import GridArticle from "@/components/GridArticle";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ kerajaan: string, subkategori: string }> 
}) {
  const { kerajaan, subkategori } = await params;
  
  const allArticles = await getArticles();
  
  // Filter by matching the category to the kerajaan name (e.g. "Kerajaan Pajang" includes "pajang")
  // and matching the subcategory exactly (e.g. "perkembangan")
  const filteredArticles = allArticles.filter(a => {
    const matchesKerajaan = a.category.toLowerCase().includes(kerajaan.toLowerCase());
    const matchesSub = a.subcategory?.toLowerCase() === subkategori.toLowerCase();
    return matchesKerajaan && matchesSub;
  });

  const formattedKerajaan = kerajaan.charAt(0).toUpperCase() + kerajaan.slice(1);
  const formattedSub = subkategori.charAt(0).toUpperCase() + subkategori.slice(1);

  return (
    <div className="bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: formattedKerajaan },
            { label: formattedSub },
          ]}
        />

        {/* Header Arsip */}
        <div className="flex flex-col items-center text-center mb-16 border-b border-gray-800 pb-12">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-yellow-500 mb-6 font-sans">
            <span>Arsip Kerajaan</span>
            <span className="text-gray-600">◆</span>
            <span className="text-white">{formattedKerajaan}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-serif text-yellow-400 tracking-tight drop-shadow-md">
            {formattedSub}
          </h1>
          <p className="mt-6 text-gray-400 max-w-2xl text-lg">
            Kumpulan catatan sejarah mengenai {formattedSub.toLowerCase()} pada masa kekuasaan {formattedKerajaan}.
          </p>
        </div>

        {/* Layout Grid & Sidebar */}
        <div className="flex flex-col lg:flex-row gap-12 mt-8">
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            {filteredArticles.length > 0 ? (
              filteredArticles.map(article => (
                <GridArticle key={article.id} article={article} />
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-gray-800 rounded-xl">
                <p className="text-gray-500 font-serif text-xl italic">
                  Belum ada catatan sejarah yang ditemukan untuk kategori ini.
                </p>
              </div>
            )}
          </div>
          
          <div className="w-full lg:w-1/3">
            <Sidebar />
          </div>
        </div>

      </div>
    </div>
  );
}
