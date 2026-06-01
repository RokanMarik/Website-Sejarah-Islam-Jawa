"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import SearchModal from "./SearchModal";

export default function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menus = [
    {
      title: "Pengging",
      submenus: ["Perkembangan", "Konflik", "Tokoh", "Warisan"]
    },
    {
      title: "Pajang",
      submenus: ["Perkembangan", "Konflik", "Tokoh", "Warisan"]
    },
    {
      title: "Mataram",
      submenus: ["Perkembangan", "Konflik", "Tokoh", "Warisan"]
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b-2 border-yellow-400 shadow-md font-sans" role="banner">
      {/* Top utility bar */}
      <div className="bg-yellow-400 text-black text-xs py-1.5 px-4 hidden md:block border-b border-yellow-500">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-bold tracking-widest uppercase">
          <span>Suluk Kebudayaan & Sejarah</span>
          <span suppressHydrationWarning>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
      
      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 relative z-10 cursor-pointer">
            <span className="text-3xl font-black tracking-tight text-white uppercase font-serif">Nusa<span className="text-yellow-400">Historia</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-300 uppercase tracking-widest h-full relative" aria-label="Navigasi utama">
            <Link href="/" className="hover:text-yellow-400 transition-colors h-full flex items-center">Beranda</Link>
            
            {/* Hierarchical Dropdown Menu */}
            <div 
              className="h-full flex items-center relative group"
              onMouseEnter={() => setActiveDropdown("kerajaan")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="hover:text-yellow-400 transition-colors flex items-center gap-1 uppercase tracking-widest text-yellow-400 border-b-2 border-yellow-400 h-full">
                Kerajaan Islam Pedalaman Jawa
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {/* Mega Menu Dropdown */}
              {activeDropdown === "kerajaan" && (
                <div className="absolute top-20 left-0 w-[600px] bg-black border-2 border-yellow-400 p-6 grid grid-cols-3 gap-6 shadow-2xl z-50 mega-menu">
                  {menus.map((menu) => (
                    <div key={menu.title}>
                      <h4 className="text-yellow-400 font-bold mb-4 pb-2 border-b border-gray-800 text-lg font-serif">{menu.title}</h4>
                      <ul className="space-y-3">
                        {menu.submenus.map(sub => (
                          <li key={sub}>
                            <Link href={`/kategori/${menu.title.toLowerCase()}/${sub.toLowerCase()}`} className="text-gray-300 hover:text-white hover:underline text-xs tracking-wider transition-all">
                              {sub}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Link href="/silsilah" className="hover:text-yellow-400 transition-colors h-full flex items-center">Silsilah</Link>
            <Link href="/kamus" className="hover:text-yellow-400 transition-colors h-full flex items-center">Kamus</Link>
            <Link href="/kuis" className="hover:text-yellow-400 transition-colors h-full flex items-center">Kuis</Link>
            
            <SearchBar />
            <SearchTrigger />
            <Link href="/bookmarks" className="hover:text-yellow-400 transition-colors h-full flex items-center" aria-label="Bookmark">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            </Link>
            <ThemeToggle />
          </nav>
          
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu" 
              className="p-2 text-yellow-400"
            >
              {isMobileMenuOpen ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}

function SearchTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        id="search-trigger"
        onClick={() => setOpen(true)}
        className="hover:text-yellow-400 transition-colors h-full flex items-center gap-2 text-gray-400"
        aria-label="Cari"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <span className="text-xs bg-gray-800 px-2 py-0.5 rounded">⌘K</span>
      </button>
      <SearchModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
