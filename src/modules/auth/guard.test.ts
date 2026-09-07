import { beforeEach, describe, expect, it, vi } from 'vitest'

const cookieStore = { value: undefined as string | undefined }

vi.mock('next/headers', () => ({
    cookies: () => ({
        get: (name: string) =>
            name === 'sp_ctrl' && cookieStore.value !== undefined ? { name, value: cookieStore.value } : undefined,
    }),
}))

import { createSession } from './session'
import { isUnlocked, requireControl } from './guard'

describe('guard', () => {
    beforeEach(() => {
        process.env.SESSION_SECRET = 'rahasia-kantor'
        cookieStore.value = undefined
    })

    it('menolak permintaan tanpa cookie', async () => {
        const response = requireControl()

        expect(isUnlocked()).toBe(false)
        expect(response?.status).toBe(401)
        await expect(response?.json()).resolves.toMatchObject({
            ok: false,
            error: { code: 'PIN_REQUIRED' },
        })
    })

    it('menolak cookie palsu', () => {
        cookieStore.value = `${Date.now() + 60_000}.palsu`

        expect(isUnlocked()).toBe(false)
        expect(requireControl()?.status).toBe(401)
    })

    it('meloloskan cookie yang sah', () => {
        cookieStore.value = createSession().value

        expect(isUnlocked()).toBe(true)
        expect(requireControl()).toBeNull()
    })
})
