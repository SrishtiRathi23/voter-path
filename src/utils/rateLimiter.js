/**
 * rateLimiter.js
 * Sliding-window rate limiter for API calls.
 * Decoupled from Gemini service for testability and reuse.
 */

/**
 * Creates a stateful rate limiter with a 1-minute sliding window.
 * @param {number} maxPerMinute - Maximum number of requests per 60-second window
 * @returns {{ check: Function, reset: Function }}
 */
export function createRateLimiter(maxPerMinute = 10) {
  let count = 0;
  let windowStart = Date.now();

  return {
    /**
     * Check if the next request is within rate limits.
     * Increments counter if allowed.
     * @returns {{ limited: boolean, waitSeconds?: number }}
     */
    check() {
      const now = Date.now();
      const elapsed = now - windowStart;

      // Reset window if 60 seconds have passed
      if (elapsed > 60_000) {
        count = 0;
        windowStart = now;
      }

      if (count >= maxPerMinute) {
        const waitSeconds = Math.ceil((60_000 - elapsed) / 1000);
        return { limited: true, waitSeconds };
      }

      count++;
      return { limited: false };
    },

    /** Manually reset the window (useful for tests) */
    reset() {
      count = 0;
      windowStart = Date.now();
    },
  };
}

// Singleton instance used by the Gemini service
export const defaultRateLimiter = createRateLimiter(
  parseInt(import.meta.env?.VITE_RATE_LIMIT_PER_MINUTE) || 10
);
