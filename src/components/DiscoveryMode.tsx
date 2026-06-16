'use client';
import { useState } from 'react';

export default function DiscoveryMode({ event, onUnlock }: { event: any, onUnlock: (id: number) => void }) {
  const [solved, setSolved] = useState(false);
  const answerRef = useRef("");

  const handleCheck = () => {
    if (answerRef.current.toLowerCase().includes(event.quiz.answerRef.current.toLowerCase())) {
      setSolved(true);
      onUnlock(event.id);
    } else {
      alert("Jawaban kurang tepat! Coba cek jurnal atau artikel sejarah lagi.");
    }
  };

  if (solved || !event.locked) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-2">
        <p className="font-bold text-green-800">🔓 Peristiwa Terungkap!</p>
        <p className="text-gray-700 mt-1">{event.description}</p>
      </div>
    );
  }

  return (
    <div className="p-4 border-2 border-dashed border-amber-400 bg-amber-50 m-2 rounded-lg">
      <p className="font-bold text-amber-800">🔒 Data Terkunci! (Mode Peneliti)</p>
      <p className="text-sm mt-2 mb-1">Pertanyaan Kunci:</p>
      <p className="italic text-gray-700 mb-3">"{event.quiz.question}"</p>
      
      <div className="flex gap-2">
        <input aria-label="Jawaban teka-teki" 
          className="border p-2 rounded flex-grow" 
          placeholder="Ketik jawaban Anda..."
          onChange={e => answerRef.current = (e.target.value)} 
        />
        <button type="button" 
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition" 
          onClick={handleCheck}
        >
          Buka
        </button>
      </div>
    </div>
  );
}
