import { beforeEach, describe, expect, it } from 'vitest'
import { SESSION_TTL_MS, createSession, readSession } from './session'

describe('session', () => {
    beforeEach(() => {
        process.env.SESSION_SECRET = 'rahasia-kantor'
    })

    it('menerima cookie yang baru dibuat', () => {
        const now = Date.now()
        const session = createSession(now)

        expect(readSession(session.value, now)).toEqual({ valid: true, expiresAt: session.expiresAt })
        expect(session.expiresAt).toBe(now + SESSION_TTL_MS)
    })

    it('menolak cookie yang tanda tangannya diubah', () => {
        const session = createSession()
        const [exp, signature] = session.value.split('.')
        const tampered = `${Number(exp) + 60_000}.${signature}`

        expect(readSession(tampered).valid).toBe(false)
    })

    it('menolak cookie yang kedaluwarsa', () => {
        const now = Date.now()
        const session = createSession(now)

        expect(readSession(session.value, now + SESSION_TTL_MS + 1).valid).toBe(false)
    })

    it('menolak cookie yang ditandatangani secret lain', () => {
        const session = createSession()
        process.env.SESSION_SECRET = 'secret-lain'

        expect(readSession(session.value).valid).toBe(false)
    })

    it('menolak nilai kosong atau bentuk yang salah', () => {
        expect(readSession(undefined).valid).toBe(false)
        expect(readSession('').valid).toBe(false)
        expect(readSession('bukan-cookie').valid).toBe(false)
    })
})
