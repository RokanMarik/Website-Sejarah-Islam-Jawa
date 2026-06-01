"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify");
        if (!res.ok) {
          router.push("/admin/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch {
        router.push("/admin/login");
      }
    };
    checkAuth();
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
