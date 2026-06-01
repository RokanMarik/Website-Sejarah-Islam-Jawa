"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Username atau password salah");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 bg-neutral-900 border-2 border-yellow-400 rounded-lg">
        <h1 className="text-3xl font-black text-yellow-400 font-serif mb-2 uppercase tracking-widest text-center">Admin</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">Masuk untuk mengelola konten</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-400 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-400 outline-none transition-colors"
              required
            />
          </div>

          {error && <div className="text-red-400 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg uppercase tracking-widest hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">← Kembali ke Beranda</a>
        </div>
      </div>
    </div>
  );
}
