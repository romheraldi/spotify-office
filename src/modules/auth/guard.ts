import { fail } from '@/lib/api-response'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, readSession } from './session'

export function currentSession() {
    return readSession(cookies().get(SESSION_COOKIE)?.value)
}

export function isUnlocked() {
    return currentSession().valid
}

// Mengembalikan respons 401 bila sesi kontrol tidak sah, atau null bila
// permintaan boleh dilanjutkan.
export function requireControl() {
    if (isUnlocked()) {
        return null
    }

    return fail('PIN_REQUIRED', 'Masukkan PIN untuk mengontrol pemutaran', 401)
}
