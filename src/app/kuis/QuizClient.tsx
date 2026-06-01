'use client';

import { useState } from 'react';
import { Question } from '@/lib/quiz-data';
import { submitQuizResult } from '@/app/quizActions';
import Link from 'next/link';

const playCorrectSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    // Pleasant double chime (C5 -> E5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
    gain2.gain.setValueAtTime(0.08, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.25);
  } catch (e) {
    console.error('Failed to play correct sound:', e);
  }
};

const playIncorrectSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    // Buzz sound (descending triangle wave)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.25);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    console.error('Failed to play incorrect sound:', e);
  }
};

export default function QuizClient({ questions, leaderboard }: { questions: Question[]; leaderboard?: Array<{ playerName: string; score: number; totalQuestions: number; category: string }> }) {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'FINISHED'>('START');
  const [playerName, setPlayerName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const filteredQuestions = selectedCategory ? questions.filter(q => q.category === selectedCategory) : questions;
  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim().length > 0) {
      setGameState('PLAYING');
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (showFeedback) return; // Prevent clicking during feedback
    
    setSelectedAnswer(optionIndex);
    setShowFeedback(true);
    
    const isCorrect = optionIndex === currentQuestion.correctOptionIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    // Wait 2 seconds before next question
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      
      if (currentQuestionIndex < filteredQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Finish Quiz
        const finalScore = score + (isCorrect ? 1 : 0);
        const percentage = Math.round((finalScore / filteredQuestions.length) * 100);
        let message = "";
        if (percentage === 100) message = "Luar Biasa! Ahli Sejarah!";
        else if (percentage >= 75) message = "Hebat! Pengetahuan Anda Sangat Baik.";
        else if (percentage >= 50) message = "Lumayan! Masih Perlu Sedikit Mengulang Sejarah.";
        else message = "Jangan Menyerah! Mari Baca Artikel Sejarah Kembali.";

        submitQuizResult(
          playerName, 
          finalScore, 
          filteredQuestions.length,
          selectedCategory || "Semua Kategori",
          message
        );

        // Save score history
        const history = JSON.parse(localStorage.getItem('quiz-history') || '[]');
        history.push({
          name: playerName,
          score: finalScore,
          total: filteredQuestions.length,
          percentage,
          date: new Date().toISOString(),
          category: selectedCategory || 'Semua',
        });
        localStorage.setItem('quiz-history', JSON.stringify(history.slice(-20)));

        setGameState('FINISHED');
      }
    }, 2000);
  };

  if (gameState === 'START') {
    return (
      <div className="w-full max-w-md bg-neutral-900 border-2 border-yellow-500 p-8 shadow-2xl relative">
        <h1 className="text-4xl font-black font-serif text-yellow-400 mb-2 uppercase tracking-widest text-center">Uji Wawasan</h1>
        <p className="text-gray-400 text-center mb-8 font-serif">Sejarah Islam Pedalaman Jawa</p>
        
        <form onSubmit={handleStart} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 uppercase tracking-widest mb-2">Nama Anda</label>
            <input 
              type="text" 
              required
              placeholder="Ketik nama Anda di sini..."
              className="w-full px-4 py-3 bg-black border border-gray-700 text-white focus:border-yellow-500 outline-none transition-colors"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 uppercase tracking-widest mb-2">Pilih Kategori</label>
            <select 
              className="w-full px-4 py-3 bg-black border border-gray-700 text-white focus:border-yellow-500 outline-none transition-colors"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="">-- Acak / Semua Kategori --</option>
              {Array.from(new Set(questions.map(q => q.category).filter(Boolean))).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest transition-colors"
          >
            Mulai Bermain
          </button>
        </form>
        <div className="mt-6 text-center space-y-3">
          <Link href="/" className="text-xs text-gray-500 hover:text-yellow-500 uppercase tracking-widest transition-colors block">← Kembali ke Beranda</Link>
          <button
            onClick={() => {
              const history = JSON.parse(localStorage.getItem('quiz-history') || '[]');
              alert(history.length > 0
                ? `Riwayat Kuis (${history.length}):\n${history.slice(-5).reverse().map((h: any) => `${h.name}: ${h.percentage}% - ${h.category}`).join('\n')}`
                : 'Belum ada riwayat kuis.'
              );
            }}
            className="text-xs text-yellow-500 hover:text-yellow-400 uppercase tracking-widest transition-colors"
          >
            📊 Lihat Riwayat Kuis
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'PLAYING') {
    const isCorrect = selectedAnswer === currentQuestion.correctOptionIndex;
    
    return (
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <div className="text-yellow-500 font-bold tracking-widest uppercase text-sm">
            Soal {currentQuestionIndex + 1} / {filteredQuestions.length}
          </div>
          <div className="text-gray-400 font-bold tracking-widest uppercase text-sm">
            Pemain: <span className="text-white">{playerName}</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-neutral-900 border border-gray-800 p-8 md:p-12 mb-8 min-h-[200px] flex items-center justify-center text-center shadow-xl">
          <h2 className="text-2xl md:text-3xl font-serif leading-relaxed text-white">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Options Grid (Quizizz Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => {
            // Determine button styling based on state
            let btnClass = "relative p-6 border-2 text-left font-bold text-lg md:text-xl transition-all duration-300 transform outline-none ";
            
            if (!showFeedback) {
              btnClass += "border-gray-700 bg-neutral-900 text-gray-300 hover:border-yellow-500 hover:-translate-y-1 hover:shadow-[0_4px_0_0_#eab308]";
            } else {
              if (index === currentQuestion.correctOptionIndex) {
                // Correct answer always glows green
                btnClass += "border-green-500 bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]";
              } else if (index === selectedAnswer && index !== currentQuestion.correctOptionIndex) {
                // Wrong answer selected glows red
                btnClass += "border-red-500 bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
              } else {
                // Other unselected options dim
                btnClass += "border-gray-800 bg-neutral-950 text-gray-600 opacity-50";
              }
            }

            return (
              <button 
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showFeedback}
                className={btnClass}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${!showFeedback ? 'border-gray-700 text-gray-500' : (index === currentQuestion.correctOptionIndex ? 'border-green-500 text-green-500' : 'border-gray-700 text-gray-600')}`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Feedback Overlay */}
        {showFeedback && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm animate-quiz-fade-in">
            <div className={`p-8 rounded-2xl border-2 text-center shadow-2xl max-w-xs w-full mx-4 quiz-feedback-modal animate-quiz-scale-up ${
              isCorrect ? 'border-green-500 shadow-green-500/20' : 'border-red-500 shadow-red-500/20'
            }`}>
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full border-4 flex items-center justify-center ${
                isCorrect ? 'quiz-feedback-correct-bg' : 'quiz-feedback-incorrect-bg'
              }`}>
                {isCorrect ? (
                  <svg className="w-10 h-10 quiz-feedback-correct-text" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 quiz-feedback-incorrect-text" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h3 className={`text-2xl font-black font-serif uppercase tracking-wider mb-1 ${
                isCorrect ? 'quiz-feedback-correct-text' : 'quiz-feedback-incorrect-text'
              }`}>
                {isCorrect ? 'Tepat Sekali!' : 'Kurang Tepat!'}
              </h3>
              <p className="text-gray-400 text-sm font-serif">
                {isCorrect ? '+1 Poin' : 'Tetap Semangat!'}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // FINISHED STATE
  const percentage = Math.round((score / filteredQuestions.length) * 100);
  let message = "";
  if (percentage === 100) message = "Luar Biasa! Ahli Sejarah!";
  else if (percentage >= 75) message = "Hebat! Pengetahuan Anda Sangat Baik.";
  else if (percentage >= 50) message = "Lumayan! Masih Perlu Sedikit Mengulang Sejarah.";
  else message = "Jangan Menyerah! Mari Baca Artikel Sejarah Kembali.";

  return (
    <div className="w-full max-w-2xl bg-neutral-900 border border-gray-800 p-8 md:p-12 shadow-2xl text-center relative overflow-hidden">
      {percentage >= 75 && (
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-600"></div>
      )}
      
      <div className="text-yellow-500 font-bold tracking-widest uppercase text-sm mb-4">Hasil Akhir Kuis</div>
      <h2 className="text-3xl md:text-5xl font-black font-serif text-white mb-2">{playerName}</h2>
      
      <div className="my-12">
        <div className={`text-8xl md:text-9xl font-black font-sans mb-4 drop-shadow-lg ${percentage >= 75 ? 'text-green-500' : percentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
          {percentage}
        </div>
        <p className="text-xl text-gray-300 font-serif">{message}</p>
      </div>

      <div className="flex justify-center gap-8 mb-12">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500">{score}</div>
          <div className="text-xs uppercase tracking-widest text-gray-500">Benar</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-500">{filteredQuestions.length - score}</div>
          <div className="text-xs uppercase tracking-widest text-gray-500">Salah</div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <button
          onClick={() => {
            const text = `Skor kuis NusaHistoria: ${percentage}% (${score}/${filteredQuestions.length}) - ${message} Coba juga!`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
          }}
          className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </button>
        <button
          onClick={() => {
            const text = `Skor kuis NusaHistoria: ${percentage}% (${score}/${filteredQuestions.length}) - ${message}`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
          }}
          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Twitter
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={() => {
            setScore(0);
            setCurrentQuestionIndex(0);
            setGameState('START');
          }}
          className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest transition-colors"
        >
          Main Ulang
        </button>
        <Link href="/" className="px-8 py-4 border-2 border-gray-700 hover:border-gray-500 text-white font-bold uppercase tracking-widest transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
