export type RateLimiter = {
  /**
   * Atomically takes a slot for `key`; returns false when it is already at
   * its limit inside the window.
   */
  tryConsume(key: string): boolean;
  /** Gives back the most recent slot taken for `key`. */
  release(key: string): void;
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
    tryConsume(key) {
      const current = now();
      sweep(current);
      const kept = recent(key, current);
      if (kept.length >= limit) {
        hits.set(key, kept);
        return false;
      }
      hits.set(key, [...kept, current]);
      return true;
    },
    release(key) {
      const kept = hits.get(key)?.slice(0, -1) ?? [];
      if (kept.length === 0) hits.delete(key);
      else hits.set(key, kept);
    },
    get size() {
      return hits.size;
    },
  };
}
