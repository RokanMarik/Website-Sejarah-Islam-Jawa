import type { Article, Organization, BreadcrumbList, WebSite } from "schema-dts";

interface JsonLdProps<T> {
  data: T;
}

export function JsonLd<T extends Record<string, unknown>>({ data }: JsonLdProps<T>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  image,
  datePublished,
  author,
  url,
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  author: string;
  url: string;
}) {
  const data: Article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    author: { "@type": "Person", name: author },
    url,
    publisher: {
      "@type": "Organization",
      name: "NusaHistoria",
      logo: { "@type": "ImageObject", url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://nusahistoria.com"}/logo.png` },
    },
  };

  return <JsonLd data={data} />;
}

export function OrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nusahistoria.com";
  const data: Organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NusaHistoria",
    url: baseUrl,
    description: "Ensiklopedia digital sejarah Islam Jawa",
  };

  return <JsonLd data={data} />;
}

export function BreadcrumbListJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data: BreadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

export function WebSiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nusahistoria.com";
  const data: WebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NusaHistoria",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/pencarian?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}
