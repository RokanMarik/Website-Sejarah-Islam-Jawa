import { getArticles } from "@/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import Ornament from "@/components/Ornament";
import Glossary from "@/components/Glossary";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedArticles from "@/components/RelatedArticles";
import ShareButtons from "@/components/ShareButtons";
import ReadingProgress from "@/components/ReadingProgress";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return { title: "Artikel Tidak Ditemukan" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nusahistoria.com";
  const ogUrl = `${baseUrl}/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}`;

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags || [article.category],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      url: `${baseUrl}/article/${article.slug}`,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [ogUrl],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="pb-20 bg-transparent min-h-screen relative overflow-hidden text-gray-200">
      
      {/* Reading Progress Bar */}
      <ReadingProgress />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 relative z-10">
        <Breadcrumbs
          items={[
            { label: article.category },
            { label: article.title },
          ]}
        />
      </div>

      {/* Header Area */}
      <header className="max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-12 relative z-10 border-b border-gray-800">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-yellow-500 mb-8 font-sans">
            <Link href="/" className="hover:text-yellow-400 transition-colors">Sejarah</Link>
            <span className="text-gray-600">◆</span>
            <span className="text-white">{article.category}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black font-serif leading-[1.1] text-yellow-400 mb-8 tracking-tight drop-shadow-md">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-400 font-serif leading-relaxed max-w-3xl">
            {article.excerpt}
          </p>
        </div>
      </header>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            author: { "@type": "Person", name: article.author },
            datePublished: article.date,
            publisher: { "@type": "Organization", name: "NusaHistoria" },
            mainEntityOfPage: `${process.env.NEXT_PUBLIC_SITE_URL || "https://nusahistoria.com"}/article/${article.slug}`,
          }),
        }}
      />

      {/* Main 3-Column Layout: Sticky Left, Content Center, Sidebar Right */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Column 1: Sticky Author Info */}
          <div className="w-full lg:w-1/5 lg:sticky lg:top-32 py-4 border-b lg:border-b-0 lg:border-r border-gray-800 pr-6">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-sans">Ditulis Oleh</div>
            <div className="text-lg font-bold text-yellow-400 font-serif mb-6">{article.author}</div>
            
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-sans">Diterbitkan</div>
            <div className="text-sm text-gray-300 font-serif mb-6">{article.date}</div>

            <div className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-sans">Waktu Baca</div>
            <div className="text-sm text-gray-300 font-serif mb-8">{article.readTime}</div>

            {article.authorInstagram && (
              <a 
                href={article.authorInstagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 mb-8 px-4 py-2 border border-gray-700 rounded-full text-xs uppercase tracking-widest font-sans text-gray-400 hover:text-yellow-400 hover:border-yellow-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Ikuti Penulis
              </a>
            )}

            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-yellow-400 hover:text-yellow-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-yellow-400 hover:text-yellow-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </button>
            </div>
          </div>

          {/* Column 2: Main Article Body */}
          <div className="w-full lg:w-3/5">
            {/* Cover Image inside article */}
            <div className="mb-12 w-full border-4 border-gray-900 bg-neutral-950">
              <div className="relative w-full h-[300px] md:h-[500px]">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 70vw"
                  className="object-cover grayscale mix-blend-luminosity"
                  priority
                />
              </div>
              <div className="text-xs text-gray-500 py-3 font-sans italic text-center uppercase tracking-widest border-t border-gray-900">
                Ilustrasi / Arsip - {article.title}
              </div>
            </div>

            {/* Main Article Space */}
            <div className="w-full">
              <Glossary content={article.content} />
            </div>
            
            <div className="mt-16 pt-8 border-t border-gray-800">
              <h3 className="font-bold font-serif text-2xl text-yellow-400 mb-6">Topik Terkait</h3>
              <div className="flex flex-wrap gap-3">
                {(article.tags && article.tags.filter(t => t).length > 0 ? article.tags.filter(t => t) : ['Sejarah Islam', 'Keraton Jawa', article.category]).map(tag => (
                  <span key={tag} className="px-4 py-2 border border-gray-700 hover:border-yellow-400 text-gray-400 hover:text-yellow-400 text-sm font-sans uppercase tracking-widest transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Related Articles */}
            <RelatedArticles currentArticle={article} allArticles={articles} />
            
            {/* Share Buttons */}
            <ShareButtons title={article.title} slug={article.slug} />
            
            {/* JSON-LD Structured Data */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Article",
                  headline: article.title,
                  description: article.excerpt,
                  author: { "@type": "Person", name: article.author },
                  datePublished: article.date,
                  publisher: {
                    "@type": "Organization",
                    name: "NusaHistoria",
                    logo: { "@type": "ImageObject", url: "https://nusahistoria.com/logo.png" },
                  },
                  image: article.coverImage,
                  keywords: article.tags?.join(", ") || article.category,
                }),
              }}
            />
          </div>

          {/* Column 3: Sidebar Right */}
          <div className="w-full lg:w-1/5">
            <Sidebar />
          </div>
        </div>
      </div>
    </article>
  );
}

// Generate static paths
export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}
