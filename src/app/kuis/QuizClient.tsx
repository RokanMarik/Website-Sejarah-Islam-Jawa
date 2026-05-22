'use client';

import { useState } from 'react';
import { Question } from '@/lib/quiz-data';
import { submitQuizResult } from '@/app/quizActions';
import Link from 'next/link';

export default function QuizClient({ questions }: { questions: Question[] }) {
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
    }

    // Wait 2 seconds before next question
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      
      if (currentQuestionIndex < filteredQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Finish Quiz
        submitQuizResult(playerName, score + (isCorrect ? 1 : 0), filteredQuestions.length);
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
        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-gray-500 hover:text-yellow-500 uppercase tracking-widest transition-colors">← Kembali ke Beranda</Link>
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
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            {isCorrect ? (
              <div className="bg-green-500 text-white px-8 py-3 rounded-full font-black text-xl uppercase tracking-widest shadow-2xl">
                Tepat Sekali! +1
              </div>
            ) : (
              <div className="bg-red-500 text-white px-8 py-3 rounded-full font-black text-xl uppercase tracking-widest shadow-2xl">
                Salah!
              </div>
            )}
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
