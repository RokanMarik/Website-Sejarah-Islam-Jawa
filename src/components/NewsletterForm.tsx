"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage("Terima kasih! Anda akan mendapat update artikel terbaru.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Terjadi kesalahan");
      }
    } catch {
      setStatus("error");
      setMessage("Terjadi kesalahan");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <div className="text-green-400 font-bold text-sm">{message}</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Anda..."
        className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-400 outline-none transition-colors"
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg uppercase tracking-widest hover:bg-yellow-400 transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {status === "error" && (
        <div className="text-red-400 text-xs sm:col-span-2">{message}</div>
      )}
    </form>
  );
}
