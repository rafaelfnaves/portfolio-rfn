export type RateLimiter = {
  /** Records an attempt for `key`; returns false when the key is over its limit. */
  tryConsume(key: string): boolean;
};

type Options = {
  limit: number;
  windowMs: number;
  now?: () => number;
};

/**
 * Sliding-window limiter kept in process memory. Good enough for a single
 * container (see ADR 0001); it resets on restart.
 */
export function createRateLimiter({
  limit,
  windowMs,
  now = Date.now,
}: Options): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    tryConsume(key) {
      const current = now();
      const recent = (hits.get(key) ?? []).filter(
        (t) => current - t < windowMs,
      );

      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }

      recent.push(current);
      hits.set(key, recent);
      return true;
    },
  };
}
