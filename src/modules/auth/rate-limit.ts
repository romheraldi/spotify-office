interface Entry {
    count: number
    resetAt: number
}

interface ConsumeOptions {
    limit?: number
    windowMs?: number
    now?: number
}

export interface ConsumeResult {
    allowed: boolean
    remaining: number
    retryAfterMs: number
}

// Hitungan disimpan di memori proses. Di serverless tiap instance punya
// hitungan sendiri, jadi ini penghalang brute force yang bersifat usaha
// terbaik, bukan jaminan mutlak.
const entries = new Map<string, Entry>()

export function consume(key: string, options: ConsumeOptions = {}): ConsumeResult {
    const { limit = 5, windowMs = 10 * 60 * 1000, now = Date.now() } = options
    const entry = entries.get(key)

    if (!entry || entry.resetAt <= now) {
        entries.set(key, { count: 1, resetAt: now + windowMs })
        return { allowed: true, remaining: limit - 1, retryAfterMs: 0 }
    }

    if (entry.count >= limit) {
        return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now }
    }

    entry.count += 1

    return { allowed: true, remaining: limit - entry.count, retryAfterMs: 0 }
}

export function resetRateLimit(key: string) {
    entries.delete(key)
}

export function clearRateLimits() {
    entries.clear()
}
