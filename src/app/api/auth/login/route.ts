import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
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
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (username === validUser && password === validPass) {
    const cookieStore = await cookies();
    cookieStore.set("admin-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    const csrfToken = await generateCsrfToken();
    return NextResponse.json({ success: true, csrfToken });
  }

  return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
}
