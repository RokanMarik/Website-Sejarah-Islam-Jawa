import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin-auth");
  
  console.log('[auth/verify] cookie:', auth?.value);
  
  if (auth?.value === "true") {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
