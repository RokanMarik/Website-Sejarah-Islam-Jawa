'use client';

import { useState } from 'react';
import Link from 'next/link';

const javaCoastline = "M120,150 C150,140 180,150 220,155 C250,160 280,140 290,120 C300,100 330,110 350,130 C380,150 430,140 460,150 C490,160 520,170 510,190 C500,210 460,210 420,200 C380,190 350,220 310,210 C270,200 240,180 200,190 C160,200 130,190 120,170 Z";
const maduraCoastline = "M455,135 C475,125 505,125 515,135 C495,145 465,145 455,135 Z";
const baliCoastline = "M525,195 C545,190 565,195 560,215 C540,215 525,205 525,195 Z";
const fullMapPath = `${javaCoastline} ${maduraCoastline} ${baliCoastline}`;

const eras = [
  { 
    year: 1527, 
    name: "Era Demak & Pengging", 
    desc: "Kesultanan Demak menguasai pesisir utara, sedangkan Kerajaan Pengging menguasai pedalaman selatan Jawa.",
    regions: [
      { id: 'pajajaran', type: 'polygon', points: "0,0 160,0 170,160 160,300 0,300", fill: '#1e3a8a', name: 'Pajajaran' },
      { id: 'cirebon', type: 'polygon', points: "160,0 230,0 230,300 160,300 170,160", fill: '#16a34a', name: 'Cirebon' },
      { id: 'demak', type: 'polygon', points: "230,0 600,0 600,155 450,155 350,165 280,175 230,165", fill: '#2563eb', name: 'Kesultanan Demak' },
      { id: 'pengging', type: 'polygon', points: "230,165 280,175 350,165 450,155 600,155 600,300 230,300", fill: '#eab308', name: 'Pengging' }
    ],
    dots: [
      { cx: 340, cy: 125, label: 'Demak Bintoro' },
      { cx: 310, cy: 180, label: 'Pengging' },
      { cx: 170, cy: 140, label: 'Cirebon' },
      { cx: 140, cy: 145, label: 'Pakuan' }
    ]
  },
  { 
    year: 1570, 
    name: "Era Kesultanan Pajang", 
    desc: "Pajang mengambil alih kekuasaan Demak dan menyatukan seluruh Jawa Tengah hingga Jawa Timur.",
    regions: [
      { id: 'banten', type: 'polygon', points: "0,0 140,0 150,150 140,300 0,300", fill: '#fde047', name: 'Banten' },
      { id: 'cirebon', type: 'polygon', points: "140,0 230,0 230,300 140,300 150,150", fill: '#16a34a', name: 'Cirebon' },
      { id: 'pajang', type: 'polygon', points: "230,0 600,0 600,300 230,300", fill: '#eab308', name: 'Kesultanan Pajang' }
    ],
    dots: [
      { cx: 330, cy: 165, label: 'Pajang' },
      { cx: 340, cy: 125, label: 'Demak' },
      { cx: 170, cy: 140, label: 'Cirebon' },
      { cx: 120, cy: 140, label: 'Banten' }
    ]
  },
  { 
    year: 1625, 
    name: "Kejayaan Mataram Islam", 
    desc: "Ekspansi besar-besaran Sultan Agung menempatkan hampir seluruh Jawa di bawah bendera Mataram Islam.",
    regions: [
      { id: 'banten', type: 'polygon', points: "0,0 140,0 150,150 140,300 0,300", fill: '#fde047', name: 'Banten' },
      { id: 'mataram', type: 'polygon', points: "140,0 600,0 600,300 140,300 150,150", fill: '#ea580c', name: 'Mataram Islam' },
      { id: 'voc', type: 'rect', x: 155, y: 125, w: 20, h: 20, fill: '#ffffff', name: 'Batavia (VOC)' }
    ],
    dots: [
      { cx: 320, cy: 185, label: 'Karta (Mataram)' },
      { cx: 460, cy: 155, label: 'Surabaya' },
      { cx: 165, cy: 135, label: 'Batavia' },
      { cx: 120, cy: 140, label: 'Banten' }
    ]
  },
  { 
    year: 1830, 
    name: "Mataram Terpecah (Pasca Perang Jawa)", 
    desc: "Intervensi Hindia Belanda membuat tanah Jawa terbagi, menyisakan Surakarta dan Yogyakarta sebagai pusat kebudayaan.",
    regions: [
      { id: 'belanda', type: 'polygon', points: "0,0 600,0 600,300 0,300", fill: '#e5e5e5', name: 'Hindia Belanda' },
      { id: 'surakarta', type: 'polygon', points: "310,130 360,130 380,160 370,190 340,210 320,180", fill: '#f472b6', name: 'Surakarta' },
      { id: 'yogyakarta', type: 'polygon', points: "280,170 320,180 340,210 330,230 270,230 260,200", fill: '#22c55e', name: 'Yogyakarta' }
    ],
    dots: [
      { cx: 340, cy: 160, label: 'Surakarta' },
      { cx: 300, cy: 195, label: 'Yogyakarta' },
      { cx: 165, cy: 135, label: 'Batavia' }
    ]
  }
];

export default function JavaMap() {
  const [activeEraIndex, setActiveEraIndex] = useState(0);
  const [hoveredRegion, setHoveredRegion] = useState<{ name: string; x: number; y: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const currentEra = eras[activeEraIndex];

  const regionToCategory: Record<string, string> = {
    "Kesultanan Demak": "Kerajaan Mataram",
    "Pengging": "Kerajaan Pengging",
    "Kesultanan Pajang": "Kerajaan Pajang",
    "Pajang": "Kerajaan Pajang",
    "Mataram Islam": "Kerajaan Mataram",
    "Banten": "Kerajaan Mataram",
    "Cirebon": "Kerajaan Mataram",
    "Pajajaran": "Kerajaan Mataram",
    "Pakuan": "Kerajaan Mataram",
    "Surakarta": "Kerajaan Mataram",
    "Yogyakarta": "Kerajaan Mataram",
    "Hindia Belanda": "Kerajaan Mataram",
    "Batavia (VOC)": "Kerajaan Mataram",
  };

  const handleRegionClick = (regionName: string) => {
    const category = regionToCategory[regionName];
    if (category) {
      // Use a generic slug based on category — the article page will find the first match
      const slugMap: Record<string, string> = {
        "Kerajaan Pengging": "kerajaan-pengging",
        "Kerajaan Pajang": "kerajaan-pajang",
        "Kerajaan Mataram": "bangkitnya-mataram-islam-panembahan-senopati",
      };
      const slug = slugMap[category] || "kerajaan-pajang";
      window.location.href = `/article/${slug}`;
    }
  };

  return (
    <div className="w-full bg-neutral-900 border border-yellow-900/30 rounded-xl p-4 md:p-8 relative overflow-hidden transition-colors duration-500 font-sans shadow-2xl">
      
      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-black text-yellow-500 font-serif mb-2 uppercase tracking-widest text-center drop-shadow-md">
          Peta Historis Tanah Jawa
        </h3>
        <p className="text-gray-400 text-center mb-8 text-sm md:text-base max-w-2xl mx-auto font-serif italic">
          {currentEra.desc}
        </p>
        
        {/* Timeline Controls */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 relative z-50">
          {eras.map((era, idx) => (
            <button
              key={era.year}
              onClick={() => setActiveEraIndex(idx)}
              className={`px-5 py-2 rounded-sm font-bold text-sm tracking-widest transition-all duration-300 border-b-2 ${
                activeEraIndex === idx 
                  ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-[0_4px_15px_rgba(234,179,8,0.15)] scale-105' 
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              {era.year}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-5xl mx-auto aspect-[2/1] bg-[#7dd3fc] rounded-md border-4 border-[#8b5a2b] flex items-center justify-center overflow-hidden shadow-inner">
          
          <svg 
            viewBox="0 0 600 300" 
            className="w-full h-full transition-transform duration-200" 
            style={{ transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`, cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={(e) => { setIsDragging(true); setDragStart({ x: e.clientX - position.x * scale, y: e.clientY - position.y * scale }); }}
            onMouseMove={(e) => { if (isDragging) setPosition({ x: (e.clientX - dragStart.x) / scale, y: (e.clientY - dragStart.y) / scale }); }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => { setIsDragging(false); setHoveredRegion(null); }}
          >
            <defs>
              <filter id="paperTexture">
                <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="4" result="noise" />
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 0.9 0 0 0  0 0.8 0 0 0  0 0 0 0.3 0" in="noise" result="coloredNoise" />
                <feBlend mode="multiply" in="SourceGraphic" in2="coloredNoise" />
              </filter>
              <clipPath id="javaIslandClip">
                <path d={fullMapPath} />
              </clipPath>
              {/* Drop shadow for the island */}
              <filter id="islandShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="2" dy="5" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Ocean Texture Background */}
            <rect width="100%" height="100%" fill="#7dd3fc" filter="url(#paperTexture)" opacity="0.8" />

            {/* Latitude/Longitude Grid Lines */}
            <g stroke="#0284c7" strokeWidth="0.5" opacity="0.3">
              {[50, 100, 150, 200, 250].map(y => <line key={`h${y}`} x1="0" y1={y} x2="600" y2={y} />)}
              {[100, 200, 300, 400, 500].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="300" />)}
            </g>

            {/* Compass Rose */}
            <g transform="translate(50, 230) scale(0.7)">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#5c3a21" strokeWidth="2" />
              <path d="M50 5 L60 50 L50 95 L40 50 Z" fill="#5c3a21" />
              <path d="M5 50 L50 40 L95 50 L50 60 Z" fill="#8b5a2b" opacity="0.8"/>
              <circle cx="50" cy="50" r="10" fill="#f8f5e6" stroke="#5c3a21" strokeWidth="2" />
              <text x="50" y="-5" fill="#5c3a21" fontSize="18" textAnchor="middle" fontWeight="bold">U</text>
            </g>

            {/* Island Drop Shadow Layer */}
            <path d={fullMapPath} fill="#000" opacity="0.2" transform="translate(2, 4)" />

            {/* Base Island (Clipped for Regions) */}
            <g clipPath="url(#javaIslandClip)">
              {/* Default Land Color */}
              <rect x="0" y="0" width="600" height="300" fill="#fde047" />
              
              {/* Render Political Regions */}
              {currentEra.regions.map(region => (
                region.type === 'polygon' ? (
                  <polygon 
                    key={`${currentEra.year}-${region.id}`}
                    points={region.points}
                    fill={region.fill}
                    stroke="#000000"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    className="transition-all duration-700 ease-in-out opacity-90 hover:opacity-100 cursor-pointer"
                    onMouseEnter={(e) => {
                      const rect = (e.target as SVGElement).getBoundingClientRect();
                      setHoveredRegion({ name: region.name, x: rect.left + rect.width / 2, y: rect.top - 10 });
                    }}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => handleRegionClick(region.name)}
                  />
                ) : (
                  <rect
                    key={`${currentEra.year}-${region.id}`}
                    x={region.x} y={region.y} width={region.w} height={region.h}
                    fill={region.fill}
                    stroke="#000000"
                    strokeWidth="1.5"
                    className="cursor-pointer"
                    onMouseEnter={(e) => {
                      const rect = (e.target as SVGElement).getBoundingClientRect();
                      setHoveredRegion({ name: region.name, x: rect.left + rect.width / 2, y: rect.top - 10 });
                    }}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => handleRegionClick(region.name)}
                  />
                )
              ))}
            </g>

            {/* Coastline Border (Draw on top for crispness) */}
            <path 
              d={fullMapPath} 
              fill="none" 
              stroke="#5c3a21" 
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Rivers (Blue lines on top of land) */}
            <g clipPath="url(#javaIslandClip)">
              <path d="M335,170 Q360,160 400,165 T450,140" fill="none" stroke="#2563eb" strokeWidth="1.5" /> {/* Bengawan Solo */}
              <path d="M440,185 Q460,190 470,175 T465,155" fill="none" stroke="#2563eb" strokeWidth="1.5" /> {/* Brantas */}
            </g>

            {/* Mountains */}
            <g fill="#44403c" stroke="#f8f5e6" strokeWidth="0.5">
              <path d="M220,170 L225,160 L230,170 Z" /> {/* Slamet */}
              <path d="M315,175 L320,165 L325,175 Z" /> {/* Merapi */}
              <path d="M335,175 L340,165 L345,175 Z" /> {/* Lawu */}
            </g>

            {/* City Markers & Labels */}
            {currentEra.dots.map((dot, idx) => (
              <g key={`dot-${currentEra.year}-${idx}`} className="animate-in fade-in zoom-in duration-500">
                {/* Town Icon */}
                <circle cx={dot.cx} cy={dot.cy} r="3" fill="#ef4444" stroke="#000" strokeWidth="1" />
                
                {/* Text Label Background for Readability */}
                <text 
                  x={dot.cx} 
                  y={dot.cy - 8} 
                  fill="none" 
                  stroke="#ffffff"
                  strokeWidth="3"
                  className="text-[12px] font-bold font-serif"
                  textAnchor="middle"
                >
                  {dot.label}
                </text>
                {/* Actual Text Label */}
                <text 
                  x={dot.cx} 
                  y={dot.cy - 8} 
                  fill="#000000" 
                  className="text-[12px] font-bold font-serif"
                  textAnchor="middle"
                >
                  {dot.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Tooltip */}
          {hoveredRegion && (
            <div
              className="fixed z-50 bg-black/90 border border-yellow-500 text-white px-4 py-2 rounded shadow-xl pointer-events-none text-sm"
              style={{ left: hoveredRegion.x, top: hoveredRegion.y, transform: "translate(-50%, -100%)" }}
            >
              <div className="font-bold text-yellow-400 font-serif">{hoveredRegion.name}</div>
              <div className="text-xs text-gray-400">Klik untuk membaca</div>
            </div>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button
              onClick={() => setScale(s => Math.min(s + 0.25, 3))}
              className="w-8 h-8 bg-black/80 border border-yellow-400 text-yellow-400 rounded flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors text-lg font-bold"
            >
              +
            </button>
            <button
              onClick={() => setScale(s => Math.max(s - 0.25, 0.5))}
              className="w-8 h-8 bg-black/80 border border-yellow-400 text-yellow-400 rounded flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors text-lg font-bold"
            >
              &minus;
            </button>
            <button
              onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}
              className="w-8 h-8 bg-black/80 border border-yellow-400 text-yellow-400 rounded flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors text-xs"
            >
              &crarr;
            </button>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 bg-black/40 p-4 rounded-lg border border-gray-800 shadow-md max-w-4xl mx-auto">
          {currentEra.regions.map(region => (
            <div key={`legend-${region.id}`} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-300">
              <span className="w-4 h-4 border border-black shadow-sm" style={{ backgroundColor: region.fill }}></span> 
              {region.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
