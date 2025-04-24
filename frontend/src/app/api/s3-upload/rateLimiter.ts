import { RateLimiterMemory } from "rate-limiter-flexible";

// Use a global symbol to persist the limiter across reloads (for dev mode)
const globalForLimiter = globalThis as unknown as {
    uploadRateLimiter?: RateLimiterMemory;
};

export const uploadRateLimiter =
    globalForLimiter.uploadRateLimiter ??
    new RateLimiterMemory({
        points: 3,
        duration: 10,
    });

if (process.env.NODE_ENV !== "production") {
    globalForLimiter.uploadRateLimiter = uploadRateLimiter;
}
