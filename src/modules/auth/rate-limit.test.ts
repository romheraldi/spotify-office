import { beforeEach, describe, expect, it } from 'vitest'
import { clearRateLimits, consume, resetRateLimit } from './rate-limit'

const options = { limit: 5, windowMs: 600_000 }

describe('rate limit', () => {
    beforeEach(() => clearRateLimits())

    it('mengizinkan percobaan sampai batas lalu menolak', () => {
        const now = Date.now()

        for (let attempt = 1; attempt <= 5; attempt++) {
            expect(consume('ip', { ...options, now }).allowed).toBe(true)
        }

        const blocked = consume('ip', { ...options, now })
        expect(blocked.allowed).toBe(false)
        expect(blocked.retryAfterMs).toBe(600_000)
    })

    it('menghitung tiap kunci secara terpisah', () => {
        const now = Date.now()
        for (let attempt = 1; attempt <= 5; attempt++) consume('ip-a', { ...options, now })

        expect(consume('ip-a', { ...options, now }).allowed).toBe(false)
        expect(consume('ip-b', { ...options, now }).allowed).toBe(true)
    })

    it('membuka kembali setelah jendela waktu lewat', () => {
        const now = Date.now()
        for (let attempt = 1; attempt <= 6; attempt++) consume('ip', { ...options, now })

        expect(consume('ip', { ...options, now: now + 600_001 }).allowed).toBe(true)
    })

    it('membersihkan hitungan setelah PIN benar', () => {
        const now = Date.now()
        for (let attempt = 1; attempt <= 5; attempt++) consume('ip', { ...options, now })
        resetRateLimit('ip')

        expect(consume('ip', { ...options, now }).allowed).toBe(true)
    })
})
