import { getQuestions } from '@/lib/quiz-data';
import QuizClient from './QuizClient';
import Ornament from '@/components/Ornament';

export default function KuisPage() {
  const questions = getQuestions();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col font-sans">
      <Ornament className="top-0 right-0 text-yellow-400 rotate-90 opacity-10" />
      <Ornament className="bottom-0 left-0 text-yellow-400 -rotate-90 opacity-10" />
      
      <main className="flex-1 flex items-center justify-center relative z-10 p-4">
        {questions.length > 0 ? (
          <QuizClient questions={questions} />
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold font-serif text-yellow-400 mb-4">Kuis Belum Tersedia</h1>
            <p className="text-gray-400">Admin belum memasukkan pertanyaan kuis. Silakan kembali lagi nanti.</p>
            <a href="/" className="inline-block mt-8 px-6 py-3 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold tracking-widest uppercase transition-colors">
              Kembali ke Beranda
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
