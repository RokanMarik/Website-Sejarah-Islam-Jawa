'use client';

import { useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Article } from '@/lib/data';
import { saveArticle, deleteArticle, uploadImage } from '@/app/actions';

// JoditEditor requires window object, so we must load it dynamically with ssr: false
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export default function AdminClient({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef(null);

  // Default empty article template
  const newArticleTemplate: Article = {
    id: '',
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1599939571322-792a326cb916?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    category: 'Kerajaan',
    author: 'Tim Redaksi',
    date: '20 Mei 2026',
    readTime: '5 min read',
    authorInstagram: '',
    isHeadline: false,
    type: 'regular',
    references: [],
  };

  const handleEdit = (article: Article) => {
    setEditingArticle({ ...article });
  };

  const handleCreateNew = () => {
    setEditingArticle({ ...newArticleTemplate });
  };

  const handleCancel = () => {
    setEditingArticle(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      await deleteArticle(id);
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadImage(formData);
      
      if (editingArticle) {
        setEditingArticle({ ...editingArticle, coverImage: result.url });
      }
    } catch (error) {
      alert('Gagal mengunggah gambar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    
    setIsSaving(true);
    
    // Auto generate slug if empty
    if (!editingArticle.slug) {
      editingArticle.slug = editingArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    try {
      await saveArticle(editingArticle);
      
      // Update local state
      if (editingArticle.id) {
        setArticles(articles.map(a => a.id === editingArticle.id ? editingArticle : a));
      } else {
        // If it was new, we don't have the exact generated ID here, so we reload to be safe or just redirect
        window.location.reload();
      }
      setEditingArticle(null);
    } catch (error) {
      alert('Gagal menyimpan artikel');
    } finally {
      setIsSaving(false);
    }
  };

  // Jodit Editor Configuration
  const config = useMemo(() => ({
    readonly: false, 
    placeholder: 'Tulis isi artikel di sini...',
    height: 500,
    toolbarSticky: true,
    uploader: {
      url: '/api/upload',
      format: 'json',
      method: 'POST'
    },
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'font', 'fontsize', 'brush', '|',
      'image', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'fullsize'
    ],
    imageDefaultWidth: 400,
  }), []);

  if (editingArticle) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">{editingArticle.id ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h2>
          <button onClick={handleCancel} className="text-gray-500 hover:text-gray-800 transition-colors">Batal</button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Judul Artikel</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={editingArticle.title}
                onChange={e => setEditingArticle({...editingArticle, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Kategori / Kerajaan</label>
              <select 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                value={editingArticle.category}
                onChange={e => setEditingArticle({...editingArticle, category: e.target.value})}
              >
                <option value="Kerajaan Demak">Kerajaan Demak</option>
                <option value="Kerajaan Pengging">Kerajaan Pengging</option>
                <option value="Kerajaan Pajang">Kerajaan Pajang</option>
                <option value="Kerajaan Mataram">Kerajaan Mataram</option>
                <option value="Tokoh Sejarah">Tokoh Sejarah</option>
                <option value="Konflik">Konflik / Peperangan</option>
                <option value="Warisan Budaya">Warisan Budaya</option>
                <option value="Lainnya">Lainnya...</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Tipe Artikel</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="articleType"
                    value="regular"
                    checked={editingArticle.type === 'regular'}
                    onChange={e => setEditingArticle({...editingArticle, type: e.target.value as 'regular' | 'scientific'})}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Biasa</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="articleType"
                    value="scientific"
                    checked={editingArticle.type === 'scientific'}
                    onChange={e => setEditingArticle({...editingArticle, type: e.target.value as 'regular' | 'scientific'})}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Ilmiah</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Sub-Kategori (Opsional)</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                value={editingArticle.subcategory || ''}
                onChange={e => setEditingArticle({...editingArticle, subcategory: e.target.value})}
              >
                <option value="">-- Tidak Ada --</option>
                <option value="Perkembangan">Perkembangan</option>
                <option value="Konflik">Konflik</option>
                <option value="Tokoh">Tokoh</option>
                <option value="Warisan">Warisan</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Gambar Sampul (Upload dari Komputer .png, .webp, .jpg)</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="file" 
                  accept="image/png, image/webp, image/jpeg, image/jpg"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                />
                {isUploading && <span className="text-sm text-blue-600 font-bold">Mengunggah...</span>}
              </div>
              {editingArticle.coverImage && (
                <div className="mt-2 text-xs text-gray-500 truncate">
                  URL Saat Ini: {editingArticle.coverImage}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Waktu Baca (misal: 5 min read)</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={editingArticle.readTime}
                onChange={e => setEditingArticle({...editingArticle, readTime: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Nama Penulis</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={editingArticle.author}
                onChange={e => setEditingArticle({...editingArticle, author: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Tanggal Terbit</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={editingArticle.date}
                onChange={e => setEditingArticle({...editingArticle, date: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Tautan Instagram Penulis (Opsional)</label>
              <input 
                type="url" 
                placeholder="https://instagram.com/username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={editingArticle.authorInstagram || ''}
                onChange={e => setEditingArticle({...editingArticle, authorInstagram: e.target.value})}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Topik Terkait / Tags (Pisahkan dengan koma)</label>
              <input 
                type="text" 
                placeholder="Sejarah, Keraton, Sunan Kalijaga"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={editingArticle.tags ? editingArticle.tags.join(', ') : ''}
                onChange={e => {
                  const tagsArray = e.target.value.split(',').map(tag => tag.trim());
                  setEditingArticle({...editingArticle, tags: tagsArray});
                }}
              />
            </div>

            {editingArticle.type === 'scientific' && (
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">Daftar Referensi (satu per baris)</label>
                <textarea
                  rows={5}
                  placeholder={`1. Kuntowijoyo. (2002). Pengantar Ilmu Sejarah. Yogyakarta: Penerbit Ombak.\n2. Ricklefs, M.C. (2005). Sejarah Indonesia Modern. Jakarta: UGM Press.`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono text-sm"
                  value={editingArticle.references?.join('\n') || ''}
                  onChange={e => {
                    const refs = e.target.value.split('\n').map(r => r.trim()).filter(r => r);
                    setEditingArticle({...editingArticle, references: refs});
                  }}
                />
                <p className="text-xs text-gray-500">Satu referensi per baris. Format: Author. (Tahun). Judul. Publisher.</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Ringkasan (Excerpt)</label>
            <textarea 
              required
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              value={editingArticle.excerpt}
              onChange={e => setEditingArticle({...editingArticle, excerpt: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Isi Artikel (Editor)</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden prose max-w-none">
              <JoditEditor
                ref={editorRef}
                value={editingArticle.content}
                config={config}
                onBlur={newContent => setEditingArticle({...editingArticle, content: newContent})}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 rounded"
                checked={editingArticle.isHeadline || false}
                onChange={e => setEditingArticle({...editingArticle, isHeadline: e.target.checked})}
              />
              <span className="text-sm font-medium text-gray-700">Jadikan Headline (Berita Utama)</span>
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Artikel'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Daftar Artikel</h2>
        <button 
          onClick={handleCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Tulis Baru
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
              <th className="p-4 font-semibold">Judul</th>
              <th className="p-4 font-semibold hidden md:table-cell">Kategori</th>
              <th className="p-4 font-semibold hidden lg:table-cell">Tanggal</th>
              <th className="p-4 font-semibold hidden lg:table-cell">Tipe</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-900 mb-1">{article.title}</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">{article.slug}</div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                    {article.category}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600 hidden lg:table-cell">{article.date}</td>
                <td className="p-4 text-center hidden lg:table-cell">
                  {article.type === 'scientific' && (
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase rounded-sm">Ilmiah</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {article.isHeadline && (
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded-sm">Headline</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(article)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Hapus"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Belum ada artikel. Silakan buat artikel baru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
