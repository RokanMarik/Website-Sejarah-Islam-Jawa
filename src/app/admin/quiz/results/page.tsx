import { getResults } from '@/lib/quiz-data';

export default function AdminQuizResultsPage() {
  const results = getResults().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="pb-20 text-gray-900 font-sans">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Hasil Kuis Pemain</h2>
        <p className="text-gray-600">Daftar skor dan riwayat permainan pengunjung situs Anda.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-700 uppercase tracking-wider">
                <th className="px-6 py-4">Waktu Bermain</th>
                <th className="px-6 py-4">Nama Pemain</th>
                <th className="px-6 py-4 text-center">Skor Benar</th>
                <th className="px-6 py-4 text-center">Nilai (Skala 100)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.length > 0 ? (
                results.map((result) => {
                  const percentage = Math.round((result.score / result.totalQuestions) * 100) || 0;
                  return (
                    <tr key={result.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{result.date}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{result.playerName}</td>
                      <td className="px-6 py-4 text-center text-sm font-medium">
                        <span className="text-green-600">{result.score}</span> / <span className="text-gray-500">{result.totalQuestions}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm ${percentage >= 80 ? 'bg-green-100 text-green-700' : percentage >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {percentage}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Belum ada pemain yang mengikuti kuis.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
