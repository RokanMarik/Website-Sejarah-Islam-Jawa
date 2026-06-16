'use client';
import { useState, useRef } from 'react';
import HistoryMap from './HistoryMap';
import DiscoveryMode from './DiscoveryMode';

// Merged Data with new fields for Map and Discovery
const events = [
    { year: "1474-1478", title: "Era Bhre Kertabumi", desc: "Masa pemerintahan Raja Majapahit terakhir.", coords: [-7.55, 112.65], locked: true, quiz: { q: "Raja terakhir Majapahit?", a: "kertabumi" } },
    { year: "1481-1482", title: "Berdirinya Kesultanan Demak", desc: "Raden Fatah diangkat menjadi sultan pertama Demak.", coords: [-6.89, 110.63], locked: true, quiz: { q: "Siapa raja pertama Demak?", a: "raden fatah" } },
    { year: "1527", title: "Penaklukan Pengging", desc: "Demak menaklukkan sisa kekuatan Majapahit.", coords: [-7.60, 110.90], locked: true, quiz: { q: "Kerajaan apa yang ditaklukkan?", a: "pengging" } },
    { year: "1546", title: "Sultan Trenggono Wafat", desc: "Memantik perebutan takhta berdarah.", coords: [-6.89, 110.63], locked: true, quiz: { q: "Siapa yang wafat?", a: "trenggono" } },
    { year: "1586", title: "Kedaulatan Mataram", desc: "Panembahan Senopati mendeklarasikan Mataram berdaulat.", coords: [-7.78, 110.37], locked: true, quiz: { q: "Siapa pendiri Mataram?", a: "senopati" } },
    { year: "1613", title: "Sultan Agung Bertahta", desc: "Mas Rangsang naik takhta.", coords: [-7.78, 110.37], locked: true, quiz: { q: "Siapa nama asli Sultan Agung?", a: "rangsang" } },
    { year: "1628-1629", title: "Serbuan ke Batavia", desc: "Serangan besar ke Batavia.", coords: [-6.17, 106.82], locked: true, quiz: { q: "Kota apa diserang?", a: "batavia" } },
    { year: "1755", title: "Perjanjian Giyanti", desc: "Mataram dibelah jadi Surakarta dan Yogyakarta.", coords: [-7.50, 110.20], locked: true, quiz: { q: "Perjanjian apa yang membelah Mataram?", a: "giyanti" } }
];

export default function Timeline() {
  const [showAll, setShowAll] = useState(false);
  const [mode, setMode] = useState<'belajar' | 'discovery'>('belajar');
  const [unlockedIds, setUnlockedIds] = useState<number[]>([]);

  return (
    <div className="w-full bg-neutral-950 border-y border-gray-800 py-16 px-4 mb-16 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-3xl font-black text-yellow-500 font-serif mb-8 text-center uppercase tracking-widest drop-shadow-md">
          Garis Waktu Sejarah
        </h3>
        
        {/* Mode Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button type="button" 
            onClick={() => setMode('belajar')}
            className={`px-6 py-2 rounded-full font-bold transition ${mode === 'belajar' ? 'bg-yellow-500 text-black' : 'bg-neutral-900 text-yellow-500 border border-yellow-500'}`}
          >
            📚 Mode Belajar (Peta)
          </button>
          <button type="button" 
            onClick={() => setMode('discovery')}
            className={`px-6 py-2 rounded-full font-bold transition ${mode === 'discovery' ? 'bg-amber-600 text-white' : 'bg-neutral-900 text-amber-500 border border-amber-500'}`}
          >
            🔓 Mode Discovery (Kuis)
          </button>
        </div>

        {/* Interactive Map (Only in Belajar Mode) */}
        {mode === 'belajar' && (
           <HistoryMap events={events} selectedYear={2000} />
        )}

        {/* Timeline Container */}
        <div className="relative mt-8">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-yellow-900/30 md:-translate-x-1/2 z-0"></div>

          <div className="space-y-8">
            {(showAll ? events : events.slice(0, 3)).map((event, index) => (
              <div key={event.id || event.year || index} className="relative flex flex-col md:flex-row items-start md:items-center group">
                
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-black border-2 border-yellow-500 md:-translate-x-1/2 mt-1.5 md:mt-0 z-10 group-hover:scale-150 group-hover:bg-yellow-500 transition-all duration-300 shadow-[0_0_10px_rgba(234,179,8,0)]"></div>

                {/* Content */}
                <div className={`w-full pl-14 md:pl-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto md:text-left'}`}>
                  
                  {mode === 'discovery' && event.locked ? (
                    <DiscoveryMode 
                      event={{...event, quiz: { question: event.quiz.q, answer: event.quiz.a }}} 
                      onUnlock={(id) => unlockedIdsRef.current = (prev => [...prev, id])} 
                    />
                  ) : (
                    <div className="bg-neutral-900 border border-gray-800 p-6 rounded-xl shadow-lg group-hover:border-yellow-600 transition-colors duration-300">
                      <div className="text-3xl font-black text-white font-serif mb-1 group-hover:text-yellow-400 transition-colors drop-shadow-md">
                        {event.year}
                      </div>
                      <div className="text-sm font-bold text-yellow-600 uppercase tracking-widest mb-3">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                        {event.desc}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>

          {/* Show More Toggle */}
          {events.length > 3 && (
            <div className="mt-16 flex justify-center">
              <button type="button" 
                onClick={() => setShowAll(!showAll)}
                className="px-8 py-3 bg-neutral-900 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold text-sm uppercase tracking-widest rounded-full transition-all duration-300"
              >
                {showAll ? 'Lebih Sedikit' : 'Baca Selengkapnya'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
