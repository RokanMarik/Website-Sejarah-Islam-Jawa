'use client';

import { useState, useRef, useEffect } from 'react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Menggunakan nama file baru untuk menghindari cache browser yang masih menyimpan error 404
    audioRef.current = new Audio('/sabilulungan.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5; // Default volume
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => {
        console.log('Audio play failed', e);
        alert('Gagal memutar audio. Pastikan file sabilulungan.mp3 bisa diakses browser.');
      });
      setIsPlaying(true);
    }
  };

  return (
    <button 
      onClick={togglePlay}
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-full py-3 px-4 shadow-2xl transition-all duration-500 border-2 audio-player-btn cursor-pointer ${isPlaying ? 'bg-yellow-500 border-yellow-400 text-black animate-pulse shadow-[0_0_20px_rgba(234,179,8,0.5)]' : 'bg-black border-gray-800 text-yellow-500 hover:border-yellow-500'}`}
      title="Putar Musik Latar"
    >
      {isPlaying ? (
        <>
          {/* Animated equalizer icon */}
          <div className="flex items-end gap-1 h-5 w-5">
            <div className="w-1 bg-black animate-[bounce_1s_infinite] h-full"></div>
            <div className="w-1 bg-black animate-[bounce_1s_infinite_0.2s] h-3/4"></div>
            <div className="w-1 bg-black animate-[bounce_1s_infinite_0.4s] h-4/5"></div>
          </div>
          <span className="text-xs uppercase tracking-widest font-bold pr-2">Musik Aktif</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <span className="text-xs uppercase tracking-widest font-bold pr-2 hidden md:block">Musik Latar</span>
        </>
      )}
    </button>
  );
}
