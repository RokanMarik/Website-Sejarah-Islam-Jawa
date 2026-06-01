import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, cleanupRateLimitStore, getRateLimitHeaders } from "@/lib/rate-limiter";
import { generateCsrfToken } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  cleanupRateLimitStore();

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
             request.headers.get("x-real-ip") || 
             "unknown";

  const rateLimit = checkRateLimit(ip, 'strict');
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many attempts. Please try again later." },
      { 
        status: 429,
        headers: { 
          "Retry-After": String(rateLimit.retryAfter || 60),
          ...getRateLimitHeaders(rateLimit),
        }
      }
    );
  }

  const body = await request.json();
  const { username, password } = body;

  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;

  if (!validUser || !validPass) {
    console.error('[auth/login] Missing ADMIN_USERNAME or ADMIN_PASSWORD env vars');
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (username === validUser && password === validPass) {
    console.log('[auth/login] Login successful for user:', username);
    const csrfToken = await generateCsrfToken();
    
    const response = NextResponse.json({ success: true, csrfToken });
    response.headers.set("Set-Cookie", `admin-auth=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400; Secure`);
    return response;
  }

  console.log('[auth/login] Login failed for user:', username);
  return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
}
