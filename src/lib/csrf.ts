import { cookies } from "next/headers";

const CSRF_COOKIE_NAME = "csrf-token";

export async function generateCsrfToken(): Promise<string> {
  const token = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  return token;
}

export async function validateCsrfToken(token: string): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  if (!cookieToken || !token) {
    return false;
  }

  return cookieToken === token;
}

export { CSRF_COOKIE_NAME };
