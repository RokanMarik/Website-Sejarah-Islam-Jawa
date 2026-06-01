"use client";

import { useState } from "react";
import { dictionary } from "@/lib/dictionary";

const eras = ["Semua", "Pengging", "Pajang", "Mataram", "Demak", "Umum"];

const eraTerms: Record<string, string[]> = {
  "Pengging": ["pengging", "kebo kenanga", "jaka tingkir", "tingkir"],
  "Pajang": ["pajang", "sultan hadiwijaya", "aryo pangiri", "pangeran benawa", "adiwijaya"],
  "Mataram": ["mataram", "senopati", "sultan agung", "kotagede", "alas mentaok", "tarikh sultan agungan", "sutawijaya", "pamanahan", "mentaok"],
  "Demak": ["demak", "raden fatah", "sunan kudus", "sunan kalijaga", "trenggana", "fatah"],
};

export default function KamusSearch() {
  const [query, setQuery] = useState("");
  const [activeEra, setActiveEra] = useState("Semua");

  const sortedKeys = Object.keys(dictionary).sort();

  const filtered = sortedKeys.filter(term => {
    const matchesQuery = query.length < 2 || term.toLowerCase().includes(query.toLowerCase()) || dictionary[term].toLowerCase().includes(query.toLowerCase());
    
    if (activeEra === "Semua") return matchesQuery;
    
    const eraKeywords = eraTerms[activeEra] || [];
    const matchesEra = eraKeywords.some(kw => term.toLowerCase().includes(kw) || dictionary[term].toLowerCase().includes(kw));
    
    return matchesQuery && matchesEra;
  });

  const groupedTerms = filtered.reduce((acc, key) => {
    const firstLetter = key.charAt(0).toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(key);
    return acc;
  }, {} as Record<string, string[]>);

  const sortedLetters = Object.keys(groupedTerms).sort();

  return (
    <div>
      {/* Search Input */}
      <div className="mb-6">
        <div className="flex items-center gap-2 bg-neutral-900 border border-gray-700 rounded-lg px-4 py-3 focus-within:border-yellow-400 transition-colors">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari istilah sejarah..."
            className="bg-transparent text-gray-200 placeholder-gray-500 outline-none flex-1"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-gray-500 hover:text-white shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Era Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {eras.map(era => (
          <button
            key={era}
            onClick={() => setActiveEra(era)}
            className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
              activeEra === era
                ? "bg-yellow-500 text-black"
                : "bg-neutral-900 text-gray-400 border border-gray-700 hover:border-yellow-400 hover:text-yellow-400"
            }`}
          >
            {era}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500 mb-6 uppercase tracking-wider">
        {filtered.length} dari {Object.keys(dictionary).length} istilah
      </div>

      {/* Results */}
      {sortedLetters.length > 0 ? (
        <div className="space-y-12">
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
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-gray-800 rounded-xl">
          <p className="text-gray-500 font-serif text-xl italic">Tidak ada istilah yang ditemukan.</p>
        </div>
      )}
    </div>
  );
}
