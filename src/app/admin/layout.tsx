import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-blue-900 text-white py-4 px-6 shadow-md flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold">NusaHistoria CMS</h1>
          <nav className="hidden md:flex gap-4">
            <Link href="/admin" className="hover:text-yellow-400 transition-colors">Artikel</Link>
            <Link href="/admin/quiz" className="hover:text-yellow-400 transition-colors">Manajemen Kuis</Link>
            <Link href="/admin/quiz/results" className="hover:text-yellow-400 transition-colors">Hasil Kuis</Link>
          </nav>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded-lg text-sm transition-colors">
            Lihat Website
          </Link>
        </div>
      </header>
      
      {/* Mobile nav */}
      <div className="md:hidden bg-blue-800 text-white p-4 flex gap-4 text-sm overflow-x-auto">
        <Link href="/admin" className="whitespace-nowrap">Artikel</Link>
        <Link href="/admin/quiz" className="whitespace-nowrap">Manajemen Kuis</Link>
        <Link href="/admin/quiz/results" className="whitespace-nowrap">Hasil Kuis</Link>
      </div>

      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
