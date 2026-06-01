export type RateLimitTier = 'strict' | 'medium' | 'loose';

interface TierConfig {
  limit: number;
  windowMs: number;
}

const TIER_CONFIGS: Record<RateLimitTier, TierConfig> = {
  strict: { limit: 5, windowMs: 60_000 },      // 5 req/min - upload, login, admin
  medium: { limit: 20, windowMs: 60_000 },      // 20 req/min - search, bookmarks
  loose:  { limit: 60, windowMs: 60_000 },      // 60 req/min - page views
};

// Sliding window: Map<ip, timestamps[]>
const store = new Map<string, { tier: RateLimitTier; timestamps: number[] }>();

export function checkRateLimit(ip: string, tier: RateLimitTier = 'loose'): { 
  allowed: boolean; 
  retryAfter?: number; 
  limit: number; 
  remaining: number;
} {
  const now = Date.now();
  const config = TIER_CONFIGS[tier];
  const key = `${ip}:${tier}`;
  
  let entry = store.get(key);
  
  if (!entry) {
    entry = { tier, timestamps: [now] };
    store.set(key, entry);
    return { allowed: true, limit: config.limit, remaining: config.limit - 1 };
  }
  
  // Remove timestamps outside the window (sliding window)
  entry.timestamps = entry.timestamps.filter(t => now - t < config.windowMs);
  
  if (entry.timestamps.length >= config.limit) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfter = Math.ceil((oldestInWindow + config.windowMs - now) / 1000);
    return { 
      allowed: false, 
      retryAfter, 
      limit: config.limit, 
      remaining: 0 
    };
  }
  
  entry.timestamps.push(now);
  return { 
    allowed: true, 
    limit: config.limit, 
    remaining: config.limit - entry.timestamps.length 
  };
}

export function getRateLimitHeaders(result: ReturnType<typeof checkRateLimit>): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    ...(result.retryAfter ? { 'Retry-After': String(result.retryAfter) } : {}),
  };
}

// Cleanup old entries (run periodically)
export function cleanupRateLimitStore() {
  const now = Date.now();
  const maxWindow = Math.max(...Object.values(TIER_CONFIGS).map(c => c.windowMs));
  
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter(t => now - t < maxWindow);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}
