import { getArticles } from "@/lib/data";
import AdminClient from "./AdminClient";
import Link from "next/link";

export default function AdminPage() {
  const articles = getArticles();

  return (
    <div className="pb-20 text-gray-900">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Artikel</h2>
        <p className="text-gray-600">Kelola konten sejarah dan informasi penulis.</p>
      </div>
      
      <AdminClient initialArticles={articles} />
    </div>
  );
}
