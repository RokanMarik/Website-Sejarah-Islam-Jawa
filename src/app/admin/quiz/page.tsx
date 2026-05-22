import { getQuestions } from '@/lib/quiz-data';
import QuizAdminClient from './QuizAdminClient';

export default function AdminQuizPage() {
  const questions = getQuestions();

  return (
    <div className="pb-20">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Kuis</h2>
        <p className="text-gray-600">Buat dan kelola pertanyaan kuis untuk pengunjung.</p>
      </div>
      
      <QuizAdminClient initialQuestions={questions} />
    </div>
  );
}
