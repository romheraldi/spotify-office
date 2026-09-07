import { beforeEach, describe, expect, it } from 'vitest'
import { isPinConfigured, verifyPin } from './pin'

describe('pin', () => {
    beforeEach(() => {
        process.env.CONTROL_PIN = '482913'
    })

    it('menerima PIN yang benar', () => {
        expect(verifyPin('482913')).toBe(true)
    })

    it('menolak PIN yang salah, termasuk yang panjangnya beda', () => {
        expect(verifyPin('482914')).toBe(false)
        expect(verifyPin('48291')).toBe(false)
        expect(verifyPin('4829130')).toBe(false)
        expect(verifyPin('')).toBe(false)
    })

    it('menolak semua PIN bila CONTROL_PIN belum diatur', () => {
        delete process.env.CONTROL_PIN

        expect(isPinConfigured()).toBe(false)
        expect(verifyPin('482913')).toBe(false)
    })
})
