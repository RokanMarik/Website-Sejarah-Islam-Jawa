import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang NusaHistoria",
  description: "Mengenal lebih dekat proyek digitalisasi sejarah Islam Jawa — dari Pengging, Pajang, hingga Mataram.",
};

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-16 lg:px-8">
        <div className="mb-12 border-b-2 border-yellow-500 pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white font-serif mb-4 uppercase tracking-wider">
            Tentang <span className="text-yellow-500">NusaHistoria</span>
          </h1>
        </div>

        <div className="article-content space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            <strong className="text-yellow-400">NusaHistoria</strong> adalah proyek digital yang didedikasikan untuk melestarikan dan menyebarluaskan sejarah Islam di pedalaman Jawa. 
            Fokus utama kami adalah transisi kekuasaan dari Kerajaan Pengging, Kesultanan Pajang, hingga Kesultanan Mataram Islam.
          </p>

          <h2>Misi Kami</h2>
          <p>
            Sejarah Nusantara seringkali terfragmentasi dalam berbagai sumber yang sulit diakses. 
            NusaHistoria hadir sebagai platform terpadu yang menyajikan narasi sejarah dalam format yang mudah dipahami, 
            lengkap dengan kamus istilah, garis waktu interaktif, dan kuis edukatif.
          </p>

          <h2>Fitur Utama</h2>
          <ul>
            <li><strong className="text-yellow-400">Artikel Sejarah</strong> — Narasi mendalam tentang kerajaan Islam pedalaman Jawa</li>
            <li><strong className="text-yellow-400">Kamus Sejarah</strong> — Referensi istilah, tokoh, dan tempat bersejarah</li>
            <li><strong className="text-yellow-400">Garis Waktu</strong> — Timeline interaktif dari 1474 hingga 1755</li>
            <li><strong className="text-yellow-400">Peta Interaktif</strong> — Eksplorasi lokasi bersejarah di Jawa</li>
            <li><strong className="text-yellow-400">Kuis Edukatif</strong> — Uji pemahaman Anda tentang sejarah Islam Jawa</li>
          </ul>

          <h2>Teknologi</h2>
          <p>
            Website ini dibangun menggunakan <strong className="text-yellow-400">Next.js 16</strong>, <strong className="text-yellow-400">React 19</strong>, 
            dan <strong className="text-yellow-400">Tailwind CSS 4</strong>. Database menggunakan SQLite untuk performa optimal.
          </p>

          <h2>Kontribusi</h2>
          <p>
            NusaHistoria adalah proyek terbuka. Jika Anda ingin berkontribusi, memperbaiki konten, atau memberikan saran, 
            silakan hubungi kami melalui halaman <Link href="/kontak" className="text-yellow-400 hover:underline">Kontak</Link>.
          </p>

          <div className="mt-12 p-6 bg-neutral-900 border border-yellow-500/30 rounded-lg">
            <p className="text-center text-yellow-400 font-serif italic text-lg">
              &quot;Bangsa yang besar adalah bangsa yang menghargai sejarah.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
