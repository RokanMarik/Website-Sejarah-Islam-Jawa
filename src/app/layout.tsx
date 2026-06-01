import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AudioPlayer from "@/components/AudioPlayer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: { 
    template: '%s | NusaHistoria', 
    default: 'NusaHistoria | Sejarah Islam Jawa' 
  },
  description: 'Mempelajari sejarah transisi kekuasaan dari Pengging, Pajang, hingga Kesultanan Mataram Islam.',
  keywords: ['sejarah islam', 'jawa', 'kerajaan', 'pengging', 'pajang', 'mataram', 'islam jawa', 'sejarah jawa'],
  authors: [{ name: 'Rokan Akbar Marik', url: 'https://instagram.com/rokanakbar14' }],
  creator: 'Rokan Akbar Marik',
  publisher: 'NusaHistoria',
  formatDetection: { email: false, telephone: false },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'NusaHistoria | Sejarah Islam Jawa',
    description: 'Mempelajari sejarah transisi kekuasaan dari Pengging, Pajang, hingga Kesultanan Mataram Islam.',
    url: 'https://nusahistoria.vercel.app',
    siteName: 'NusaHistoria',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'NusaHistoria - Sejarah Islam Jawa' }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NusaHistoria | Sejarah Islam Jawa',
    description: 'Mempelajari sejarah transisi kekuasaan dari Pengging, Pajang, hingga Kesultanan Mataram Islam.',
    images: ['/og-image.svg'],
    creator: '@rokanakbar14',
  },
  alternates: {
    canonical: 'https://nusahistoria.vercel.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${merriweather.variable} antialiased bg-keraton-pattern text-gray-200 font-sans min-h-screen selection:bg-yellow-400 selection:text-black transition-colors duration-1000`}
      >
        <Navigation />
        <main>{children}</main>
        <AudioPlayer />
        
        <footer className="bg-black text-gray-500 py-12 border-t border-gray-800 mt-20 transition-colors duration-1000">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col items-center justify-center gap-6">
            <div className="text-3xl font-bold tracking-widest text-white uppercase font-serif">Nusa<span className="text-yellow-400">Historia</span></div>
            <div className="flex gap-6 text-yellow-400 font-bold tracking-widest uppercase text-sm">
              <a href="https://www.instagram.com/rokanakbar14/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
              <a href="https://saweria.co/KalaKata" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
                Dukung di Saweria
              </a>
            </div>
            <div className="w-24 h-1 bg-yellow-400"></div>
            <div className="text-xs uppercase tracking-widest">© {new Date().getFullYear()} Kerajaan Islam Pedalaman Jawa</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
