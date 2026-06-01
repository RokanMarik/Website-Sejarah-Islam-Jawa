import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak | NusaHistoria",
  description: "Hubungi tim NusaHistoria untuk saran, kolaborasi, atau pertanyaan tentang sejarah Islam Jawa.",
};

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-16 lg:px-8">
        <div className="mb-12 border-b-2 border-yellow-500 pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white font-serif mb-4 uppercase tracking-wider">
            Hubungi <span className="text-yellow-500">Kami</span>
          </h1>
          <p className="text-lg text-gray-400 font-sans">
            Punya pertanyaan, saran, atau ingin berkolaborasi? Kami senang mendengar dari Anda.
          </p>
        </div>

        <div className="space-y-10">
          {/* Email */}
          <div className="bg-neutral-900 border border-gray-800 p-6 rounded-xl hover:border-yellow-500/50 transition-colors">
            <h2 className="text-xl font-bold text-yellow-400 mb-2 uppercase tracking-wider flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </h2>
            <a href="mailto:nusahistoria@gmail.com" className="text-gray-300 hover:text-yellow-400 transition-colors text-lg">
              nusahistoria@gmail.com
            </a>
          </div>

          {/* Social */}
          <div className="bg-neutral-900 border border-gray-800 p-6 rounded-xl hover:border-yellow-500/50 transition-colors">
            <h2 className="text-xl font-bold text-yellow-400 mb-4 uppercase tracking-wider flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Media Sosial
            </h2>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.instagram.com/rokanakbar14/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="bg-neutral-900 border border-gray-800 p-6 rounded-xl hover:border-yellow-500/50 transition-colors">
            <h2 className="text-xl font-bold text-yellow-400 mb-2 uppercase tracking-wider flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
              Dukung Proyek
            </h2>
            <p className="text-gray-400 mb-3">Bantu kami terus menyajikan konten sejarah berkualitas.</p>
            <a
              href="https://saweria.co/KalaKata"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              Saweria
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
