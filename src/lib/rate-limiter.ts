interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

const store = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry) {
    store.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (now - entry.firstAttempt > WINDOW_MS) {
    store.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  entry.count += 1;

  if (entry.count > MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((entry.firstAttempt + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [ip, entry] of store.entries()) {
    if (now - entry.firstAttempt > WINDOW_MS) {
      store.delete(ip);
    }
  }
}
