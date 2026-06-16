'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const MOBILE_MENUS = [
  { title: "Pengging", submenus: ["Perkembangan", "Konflik", "Tokoh", "Warisan"] },
  { title: "Pajang", submenus: ["Perkembangan", "Konflik", "Tokoh", "Warisan"] },
  { title: "Mataram", submenus: ["Perkembangan", "Konflik", "Tokoh", "Warisan"] },
];

export default function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [expandedKerajaan, setExpandedKerajaan] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClose()} aria-label="Tutup menu" />
      <div className="absolute right-0 top-0 h-full w-80 bg-neutral-950 border-l-2 border-yellow-400 overflow-y-auto">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <span className="text-yellow-400 font-bold uppercase tracking-wider">Menu</span>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-4">
          <Link href="/" onClick={onClose} className="block py-2 text-white hover:text-yellow-400 font-bold uppercase">Beranda</Link>

          <div>
            <button type="button" onClick={() => setExpandedKerajaan(expandedKerajaan ? null : "kerajaan")} className="w-full text-left py-2 text-yellow-400 hover:text-yellow-300 font-bold uppercase flex justify-between">
              Kerajaan Islam <span>{expandedKerajaan ? "▲" : "▼"}</span>
            </button>
            {expandedKerajaan && (
              <div className="pl-4 space-y-3 mt-2">
                {MOBILE_MENUS.map(menu => (
                  <div key={menu.title}>
                    <h4 className="text-white font-bold text-sm">{menu.title}</h4>
                    <ul className="pl-4 space-y-1 mt-1">
                      {menu.submenus.map(sub => (
                        <li key={sub}>
                          <Link href={`/kategori/${menu.title.toLowerCase()}/${sub.toLowerCase()}`} onClick={onClose} className="text-gray-400 hover:text-white text-sm">{sub}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/silsilah" onClick={onClose} className="block py-2 text-white hover:text-yellow-400 font-bold uppercase">Silsilah</Link>
          <Link href="/kamus" onClick={onClose} className="block py-2 text-white hover:text-yellow-400 font-bold uppercase">Kamus</Link>
          <Link href="/kuis" onClick={onClose} className="block py-2 text-white hover:text-yellow-400 font-bold uppercase">Kuis</Link>
          <Link href="/bookmarks" onClick={onClose} className="block py-2 text-white hover:text-yellow-400 font-bold uppercase">Bookmark</Link>
          <div className="flex items-center gap-3 py-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </div>
  );
}
