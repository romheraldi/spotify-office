import { fail, ok } from '@/lib/api-response'
import { isPinConfigured, verifyPin } from '@/modules/auth/pin'
import { consume, resetRateLimit } from '@/modules/auth/rate-limit'
import { SESSION_COOKIE, SESSION_TTL_MS, createSession } from '@/modules/auth/session'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

function clientKey(req: NextRequest) {
    const forwarded = req.headers.get('x-forwarded-for')

    return forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'anonim'
}

export async function POST(req: NextRequest) {
    if (!isPinConfigured() || !process.env.SESSION_SECRET) {
        return fail('PIN_NOT_CONFIGURED', 'CONTROL_PIN atau SESSION_SECRET belum diatur di server', 500)
    }

    const key = clientKey(req)
    const attempt = consume(key)

    if (!attempt.allowed) {
        const minutes = Math.max(1, Math.ceil(attempt.retryAfterMs / 60_000))

        return fail('TOO_MANY_ATTEMPTS', `Terlalu banyak percobaan, coba lagi dalam ${minutes} menit`, 429)
    }

    const body = await req.json().catch(() => ({}))
    const pin = typeof body?.pin === 'string' ? body.pin : ''

    if (!verifyPin(pin)) {
        return fail('WRONG_PIN', `PIN salah, sisa ${attempt.remaining} percobaan`, 401)
    }

    resetRateLimit(key)

    const session = createSession()
    const response = ok({ expiresAt: session.expiresAt })

    response.cookies.set({
        name: SESSION_COOKIE,
        value: session.value,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: SESSION_TTL_MS / 1000,
    })

    return response
}

export async function DELETE() {
    const response = ok({ unlocked: false })

    response.cookies.set({ name: SESSION_COOKIE, value: '', path: '/', maxAge: 0 })

    return response
}
