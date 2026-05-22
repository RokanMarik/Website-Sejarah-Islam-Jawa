export default function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none opacity-20 ${className}`}>
      <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Motif geometris mirip referensi keraton/Jawa */}
        <rect x="0" y="80" width="400" height="4" fill="currentColor"/>
        <rect x="0" y="140" width="400" height="4" fill="currentColor"/>
        <rect x="0" y="200" width="400" height="4" fill="currentColor"/>
        
        <rect x="80" y="0" width="4" height="400" fill="currentColor"/>
        <rect x="140" y="0" width="4" height="400" fill="currentColor"/>
        
        {/* Aksen Batik Kawung sederhana */}
        <circle cx="250" cy="250" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="250" cy="330" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="330" cy="250" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="330" cy="330" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M250 250 L330 330 M330 250 L250 330" stroke="currentColor" strokeWidth="2"/>
      </svg>
    </div>
  );
}
