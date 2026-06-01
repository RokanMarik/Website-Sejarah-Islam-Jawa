import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  const validUser = process.env.ADMIN_USERNAME || "admin";
  const validPass = process.env.ADMIN_PASSWORD || "nusahistoria2024";

  if (username === validUser && password === validPass) {
    const cookieStore = await cookies();
    cookieStore.set("admin-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
}
