import { createHmac, timingSafeEqual } from 'crypto'

export const SESSION_COOKIE = 'sp_ctrl'
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000

export interface Session {
    value: string
    expiresAt: number
}

export interface SessionState {
    valid: boolean
    expiresAt?: number
}

function secret() {
    const value = process.env.SESSION_SECRET

    if (!value) {
        throw new Error('SESSION_SECRET belum diatur')
    }

    return value
}

function sign(expiresAt: number) {
    return createHmac('sha256', secret()).update(String(expiresAt)).digest('hex')
}

export function createSession(now = Date.now()): Session {
    const expiresAt = now + SESSION_TTL_MS

    return { value: `${expiresAt}.${sign(expiresAt)}`, expiresAt }
}

export function readSession(value: string | undefined, now = Date.now()): SessionState {
    if (!value) {
        return { valid: false }
    }

    const [rawExpiresAt, signature] = value.split('.')
    const expiresAt = Number(rawExpiresAt)

    if (!rawExpiresAt || !signature || !Number.isFinite(expiresAt)) {
        return { valid: false }
    }

    let expected: string
    try {
        expected = sign(expiresAt)
    } catch {
        return { valid: false }
    }

    const given = Buffer.from(signature)
    const wanted = Buffer.from(expected)

    if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) {
        return { valid: false }
    }

    if (expiresAt <= now) {
        return { valid: false }
    }

    return { valid: true, expiresAt }
}
