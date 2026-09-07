import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import useProgress from './use-progress'

describe('useProgress', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('menambah progres selama lagu berjalan', () => {
        const { result } = renderHook(() =>
            useProgress({ progressMs: 10_000, durationMs: 200_000, isPlaying: true, trackId: 'a' }),
        )

        act(() => vi.advanceTimersByTime(2_000))

        expect(result.current).toBeGreaterThanOrEqual(11_900)
        expect(result.current).toBeLessThanOrEqual(12_100)
    })

    it('berhenti menambah saat pemutaran dijeda', () => {
        const { result } = renderHook(() =>
            useProgress({ progressMs: 10_000, durationMs: 200_000, isPlaying: false, trackId: 'a' }),
        )

        act(() => vi.advanceTimersByTime(5_000))

        expect(result.current).toBe(10_000)
    })

    it('tidak melewati durasi lagu', () => {
        const { result } = renderHook(() =>
            useProgress({ progressMs: 9_000, durationMs: 10_000, isPlaying: true, trackId: 'a' }),
        )

        act(() => vi.advanceTimersByTime(5_000))

        expect(result.current).toBe(10_000)
    })

    it('menyetel ulang ketika lagu berganti', () => {
        const { result, rerender } = renderHook(props => useProgress(props), {
            initialProps: { progressMs: 100_000, durationMs: 200_000, isPlaying: true, trackId: 'a' },
        })

        rerender({ progressMs: 0, durationMs: 180_000, isPlaying: true, trackId: 'b' })

        expect(result.current).toBe(0)
    })
})
