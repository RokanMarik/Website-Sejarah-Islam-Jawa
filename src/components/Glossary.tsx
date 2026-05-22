'use client';

import { useState, useEffect } from 'react';
import { dictionary } from '../lib/dictionary';

export default function Glossary({ content }: { content: string }) {
  const [activeTerm, setActiveTerm] = useState<{term: string, meaning: string, x: number, y: number} | null>(null);

  useEffect(() => {
    // Hide tooltip on scroll to prevent it from floating disconnected
    const handleScroll = () => setActiveTerm(null);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // This is a simplified client-side parser that wraps known terms with hover events.
  // In a real large app, this string manipulation should be robust or done via unified/remark.
  const createMarkup = () => {
    let html = content;
    Object.keys(dictionary).forEach(term => {
      // Negative lookahead (?![^<]*>) ensures we don't match words inside HTML tags like <img alt="term">
      const regex = new RegExp(`\\b(${term})\\b(?![^<]*>)`, 'gi');
      html = html.replace(regex, `<span class="glossary-term cursor-help border-b border-dashed border-yellow-500 text-yellow-500 font-bold hover:bg-yellow-500/10 transition-colors" data-term="${term}">$1</span>`);
    });
    return { __html: html };
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('glossary-term')) {
      const termKey = target.getAttribute('data-term')?.toLowerCase();
      if (termKey && dictionary[termKey]) {
        const rect = target.getBoundingClientRect();
        
        // Calculate safe left position to avoid overflowing screen edges
        const tooltipWidth = 320; // max-w-xs approx
        let safeLeft = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        
        // Boundaries for narrow mobile screens
        if (safeLeft < 16) safeLeft = 16;
        if (safeLeft + tooltipWidth > window.innerWidth - 16) {
           safeLeft = Math.max(16, window.innerWidth - tooltipWidth - 16);
        }

        setActiveTerm({
          term: target.innerText,
          meaning: dictionary[termKey],
          x: safeLeft,
          y: rect.top - 10 // Position slightly above
        });
      }
    }
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('glossary-term')) {
      setActiveTerm(null);
    }
  };

  return (
    <>
      <div 
        className="article-content"
        dangerouslySetInnerHTML={createMarkup()}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      />
      
      {/* Tooltip Portal rendered fixed on screen */}
      {activeTerm && (
        <div 
          className="fixed z-50 bg-black/90 border border-yellow-500 text-white p-4 rounded shadow-2xl w-[90vw] max-w-xs pointer-events-none transform -translate-y-full animate-fade-in"
          style={{ left: activeTerm.x, top: activeTerm.y }}
        >
          <div className="font-bold text-yellow-400 mb-1 border-b border-gray-700 pb-1 font-serif">{activeTerm.term}</div>
          <div className="text-sm text-gray-300 leading-relaxed font-sans">{activeTerm.meaning}</div>
        </div>
      )}
    </>
  );
}
