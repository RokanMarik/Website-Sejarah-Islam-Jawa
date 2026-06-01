"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        
        const res = await fetch("/api/auth/verify", { signal: controller.signal });
        clearTimeout(timeout);
        
        if (!res.ok) {
          if (!cancelled) router.push("/admin/login");
        } else {
          if (!cancelled) setIsAuthenticated(true);
        }
      } catch {
        if (!cancelled) router.push("/admin/login");
      }
    };
    checkAuth();
    return () => { cancelled = true; };
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <div className="text-yellow-400 text-xl font-serif">Memeriksa autentikasi...</div>
      </div>
    );
  }

  return <>{children}</>;
}
