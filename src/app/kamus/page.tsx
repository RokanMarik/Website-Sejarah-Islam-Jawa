import { Metadata } from "next";
import KamusSearch from "@/components/KamusSearch";

export const metadata: Metadata = {
  title: "Kamus Sejarah Jawa | NusaHistoria",
  description: "Daftar istilah, tokoh, dan tempat penting dalam sejarah kerajaan Islam di tanah Jawa.",
};

export default function KamusPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-12 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b-2 border-yellow-500 pb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-white font-serif mb-4 uppercase tracking-wider">
            Kamus <span className="text-yellow-500">Sejarah</span>
          </h1>
          <p className="text-lg text-gray-400 font-sans max-w-2xl">
            Eksplorasi daftar istilah, tokoh penting, dan tempat bersejarah pada masa kejayaan Kerajaan Islam di pedalaman Jawa (Pengging, Pajang, dan Mataram).
          </p>
        </div>

        <KamusSearch />
        
      </div>
    </div>
  );
}
