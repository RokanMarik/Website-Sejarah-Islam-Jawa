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
        console.log('[AuthGuard] Checking auth...');
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        
        const res = await fetch("/api/auth/verify", { signal: controller.signal });
        clearTimeout(timeout);
        
        console.log('[AuthGuard] Verify response:', res.status);
        
        if (!res.ok) {
          console.log('[AuthGuard] Not authenticated, redirecting to login');
          if (!cancelled) router.push("/admin/login");
        } else {
          console.log('[AuthGuard] Authenticated!');
          if (!cancelled) setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('[AuthGuard] Auth check failed:', err);
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
