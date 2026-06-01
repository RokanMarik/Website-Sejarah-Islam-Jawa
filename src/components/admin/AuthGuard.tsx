"use client";

// AuthGuard is now a passthrough - middleware.ts handles server-side auth
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
