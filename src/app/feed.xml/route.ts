import { getArticles } from "@/lib/data";

export const dynamic = "force-static";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = getArticles();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nusahistoria.com";

  const items = articles.map(article => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteUrl}/article/${article.slug}</link>
      <guid>${siteUrl}/article/${article.slug}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <description>${escapeXml(article.excerpt)}</description>
      <category>${escapeXml(article.category)}</category>
      ${article.tags?.map(t => `<tags>${escapeXml(t)}</tags>`).join("") || ""}
    </item>`).join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NusaHistoria | Sejarah Islam Jawa</title>
    <link>${siteUrl}</link>
    <description>Ensiklopedia digital sejarah Islam Jawa — menelusuri transisi kekuasaan dari Pengging, Pajang, hingga Kesultanan Mataram Islam.</description>
    <language>id-id</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
