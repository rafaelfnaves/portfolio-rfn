export type RateLimiter = {
  /** True when `key` already has `limit` attempts inside the window. */
  isLimited(key: string): boolean;
  /** Counts an attempt for `key`. */
  record(key: string): void;
  /** Number of keys currently tracked. */
  readonly size: number;
};

type Options = {
  limit: number;
  windowMs: number;
  now?: () => number;
};

/**
 * Sliding-window limiter kept in process memory. Good enough for a single
 * container (see ADR 0001); it resets on restart. Expired keys are swept at
 * most once per window so memory stays bounded by recent traffic.
 */
export function createRateLimiter({
  limit,
  windowMs,
  now = Date.now,
}: Options): RateLimiter {
  const hits = new Map<string, number[]>();
  let lastSweep = now();

  function recent(key: string, current: number): number[] {
    return (hits.get(key) ?? []).filter((t) => current - t < windowMs);
  }

  function sweep(current: number) {
    if (current - lastSweep < windowMs) return;
    lastSweep = current;
    for (const key of hits.keys()) {
      const kept = recent(key, current);
      if (kept.length === 0) hits.delete(key);
      else hits.set(key, kept);
    }
  }

  return {
    isLimited(key) {
      const current = now();
      sweep(current);
      return recent(key, current).length >= limit;
    },
    record(key) {
      const current = now();
      sweep(current);
      hits.set(key, [...recent(key, current), current]);
    },
    get size() {
      return hits.size;
    },
  };
}
