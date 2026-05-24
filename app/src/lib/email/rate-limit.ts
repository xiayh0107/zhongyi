// 简单的内存速率限制 — 同邮箱 60 秒内最多 1 次 magic link
// MVP 实现：单进程内存。生产多实例需要切到 Redis / Vercel KV。

const RATE_LIMIT_WINDOW_MS = 60_000;
const lastSendByEmail = new Map<string, number>();

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

export function checkEmailRateLimit(email: string): RateLimitResult {
  const now = Date.now();
  const key = email.toLowerCase().trim();
  const last = lastSendByEmail.get(key);
  if (last && now - last < RATE_LIMIT_WINDOW_MS) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((RATE_LIMIT_WINDOW_MS - (now - last)) / 1000),
    };
  }
  lastSendByEmail.set(key, now);
  // 简单清理：超过 5 分钟的记录删掉
  if (lastSendByEmail.size > 1000) {
    const cutoff = now - 5 * RATE_LIMIT_WINDOW_MS;
    for (const [k, v] of lastSendByEmail) {
      if (v < cutoff) lastSendByEmail.delete(k);
    }
  }
  return { ok: true };
}
