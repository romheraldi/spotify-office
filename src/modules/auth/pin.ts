import { createHash, timingSafeEqual } from 'crypto'

export function isPinConfigured() {
    return !!process.env.CONTROL_PIN
}

function digest(value: string) {
    return createHash('sha256').update(value).digest()
}

export function verifyPin(input: string) {
    const pin = process.env.CONTROL_PIN

    if (!pin || !input) {
        return false
    }

    // Dibandingkan lewat hash agar panjang buffer selalu sama,
    // sehingga waktu perbandingan tidak membocorkan panjang PIN.
    return timingSafeEqual(digest(input), digest(pin))
}
