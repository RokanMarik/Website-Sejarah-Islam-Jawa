import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-xs uppercase tracking-widest font-sans flex-wrap">
        <li>
          <Link href="/" className="text-gray-500 hover:text-yellow-400 transition-colors">
            Beranda
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="text-gray-700">◆</span>
            {item.href ? (
              <Link href={item.href} className="text-gray-500 hover:text-yellow-400 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-yellow-400">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
