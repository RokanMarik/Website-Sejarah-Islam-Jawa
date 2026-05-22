import { dictionary } from "@/lib/dictionary";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kamus Sejarah Jawa | NusaHistoria",
  description: "Daftar istilah, tokoh, dan tempat penting dalam sejarah kerajaan Islam di tanah Jawa.",
};

export default function KamusPage() {
  // Sort dictionary keys alphabetically
  const sortedKeys = Object.keys(dictionary).sort();

  // Group by first letter
  const groupedTerms = sortedKeys.reduce((acc, key) => {
    const firstLetter = key.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(key);
    return acc;
  }, {} as Record<string, string[]>);

  const sortedLetters = Object.keys(groupedTerms).sort();

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

        {/* Index Jump Links */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center md:justify-start">
          {sortedLetters.map(letter => (
            <a 
              key={letter}
              href={`#letter-${letter}`}
              className="w-10 h-10 flex items-center justify-center rounded bg-gray-900 border border-gray-700 text-yellow-500 font-bold hover:bg-yellow-500 hover:text-black transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Dictionary Content */}
        <div className="space-y-16">
          {sortedLetters.map(letter => (
            <div key={letter} id={`letter-${letter}`} className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-800 pb-2">
                <h2 className="text-4xl font-black text-yellow-500 font-serif">{letter}</h2>
                <div className="h-px bg-gray-800 flex-1"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {groupedTerms[letter].map(term => (
                  <div key={term} className="bg-gray-900/50 p-5 rounded-lg border border-gray-800 hover:border-yellow-500/50 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-2 capitalize font-serif text-yellow-100">
                      {term}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {dictionary[term]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
