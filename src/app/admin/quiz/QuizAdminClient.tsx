'use client';

import { useState } from 'react';
import { Question } from '@/lib/quiz-data';
import { saveQuizQuestion, deleteQuizQuestion } from '@/app/quizActions';

export default function QuizAdminClient({ initialQuestions }: { initialQuestions: Question[] }) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const emptyQuestion: Question = {
    id: '',
    text: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    category: ''
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion({ ...question, options: [...question.options] });
  };

  const handleAddNew = () => {
    setEditingQuestion({ ...emptyQuestion, options: [...emptyQuestion.options] });
  };

  const handleCancel = () => {
    setEditingQuestion(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus soal ini?')) {
      await deleteQuizQuestion(id);
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    
    // Validate
    if (editingQuestion.options.some(opt => opt.trim() === '')) {
      alert('Semua pilihan ganda harus diisi!');
      return;
    }

    setIsSaving(true);
    try {
      await saveQuizQuestion(editingQuestion);
      
      // Update local state
      if (editingQuestion.id) {
        setQuestions(questions.map(q => q.id === editingQuestion.id ? editingQuestion : q));
      } else {
        // Just reload for simplicity to get the new ID, or we can just append a temp one
        window.location.reload();
      }
      
      setEditingQuestion(null);
    } catch (error) {
      alert('Gagal menyimpan soal');
    } finally {
      setIsSaving(false);
    }
  };

  const updateOption = (index: number, value: string) => {
    if (!editingQuestion) return;
    const newOptions = [...editingQuestion.options];
    newOptions[index] = value;
    setEditingQuestion({ ...editingQuestion, options: newOptions });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 text-gray-900 font-sans">
      
      {/* Sidebar: List of Questions */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Daftar Soal</h3>
          <button 
            onClick={handleAddNew}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            + Soal Baru
          </button>
        </div>
        
        <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2">
          {questions.map((q, idx) => (
            <div 
              key={q.id} 
              className={`p-4 border rounded-lg cursor-pointer transition ${editingQuestion?.id === q.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
              onClick={() => handleEdit(q)}
            >
              <div className="font-bold text-sm text-gray-500 mb-1">Soal {idx + 1}</div>
              <h4 className="font-medium text-gray-900 line-clamp-2">{q.text}</h4>
            </div>
          ))}
          {questions.length === 0 && (
            <div className="text-center p-8 text-gray-400">Belum ada soal.</div>
          )}
        </div>
      </div>

      {/* Main Area: Editor */}
      <div className="w-full lg:w-2/3">
        {editingQuestion ? (
          <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-xl shadow border border-gray-200">
            <h3 className="font-bold text-xl mb-6">
              {editingQuestion.id ? 'Edit Soal' : 'Tulis Soal Baru'}
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Pertanyaan</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingQuestion.text}
                  onChange={e => setEditingQuestion({...editingQuestion, text: e.target.value})}
                  placeholder="Ketik pertanyaan kuis di sini..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Kategori Soal (Opsional)</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={editingQuestion.category || ''}
                  onChange={e => setEditingQuestion({...editingQuestion, category: e.target.value})}
                >
                  <option value="">-- Umum / Semua Kategori --</option>
                  <option value="Kerajaan Pengging">Kerajaan Pengging</option>
                  <option value="Kerajaan Pajang">Kerajaan Pajang</option>
                  <option value="Kerajaan Mataram">Kerajaan Mataram</option>
                  <option value="Kerajaan Demak">Kerajaan Demak</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pilihan Ganda & Kunci Jawaban</label>
                
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${editingQuestion.correctOptionIndex === index ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    <input 
                      type="radio" 
                      name="correctOption"
                      id={`option-${index}`}
                      checked={editingQuestion.correctOptionIndex === index}
                      onChange={() => setEditingQuestion({...editingQuestion, correctOptionIndex: index})}
                      className="w-5 h-5 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor={`option-${index}`} className="font-bold text-gray-500 w-8">
                      {String.fromCharCode(65 + index)}.
                    </label>
                    <input 
                      type="text" 
                      required
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={editingQuestion.options[index]}
                      onChange={e => updateOption(index, e.target.value)}
                      placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-2">Pilih tombol radio (bulat) hijau untuk menandai kunci jawaban yang benar.</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
              {editingQuestion.id ? (
                <button 
                  type="button" 
                  onClick={() => handleDelete(editingQuestion.id!)}
                  className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
                >
                  Hapus Soal
                </button>
              ) : <div></div>}
              
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Soal'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-white p-12 rounded-xl shadow border border-gray-200 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Manajemen Kuis</h3>
            <p className="text-gray-500 max-w-md">Pilih soal dari daftar di sebelah kiri untuk mengedit, atau buat soal baru untuk kuis pengunjung Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
