'use client'
import { ApiError, apiDelete, apiGet, apiPost } from '@/lib/api-client'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { RepeatState } from './data/control'
import { PlayerSnapshot } from './data/player'
import { DeviceData } from './types/playback'

export interface Toast {
    id: number
    message: string
    tone: 'info' | 'error' | 'success'
}

interface OptimisticPatch {
    isPlaying?: boolean
    shuffle?: boolean
    repeat?: RepeatState
    volume?: number
    progressMs?: number
}

interface ControlOptions {
    patch?: OptimisticPatch
    silent?: boolean
}

interface PlayerContextValue {
    snapshot: PlayerSnapshot
    patch: OptimisticPatch
    devices: DeviceData[]
    unlocked: boolean
    pendingAction: string | null
    toasts: Toast[]
    pinOpen: boolean
    control: (action: string, body?: Record<string, unknown>, options?: ControlOptions) => Promise<boolean>
    refresh: () => Promise<void>
    notify: (message: string, tone?: Toast['tone']) => void
    dismissToast: (id: number) => void
    requestUnlock: () => Promise<boolean>
    submitPin: (pin: string) => Promise<void>
    closePin: () => void
    lock: () => Promise<void>
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

const POLL_INTERVAL_MS = 3000
const REVALIDATE_DELAY_MS = 800

export function usePlayer() {
    const context = useContext(PlayerContext)

    if (!context) {
        throw new Error('usePlayer harus dipakai di dalam PlayerProvider')
    }

    return context
}

interface PlayerProviderProps {
    initialSnapshot: PlayerSnapshot
    initialUnlocked: boolean
    children: React.ReactNode
}

export function PlayerProvider({ initialSnapshot, initialUnlocked, children }: PlayerProviderProps) {
    const [snapshot, setSnapshot] = useState(initialSnapshot)
    const [patch, setPatch] = useState<OptimisticPatch>({})
    const [unlocked, setUnlocked] = useState(initialUnlocked)
    const [pendingAction, setPendingAction] = useState<string | null>(null)
    const [toasts, setToasts] = useState<Toast[]>([])
    const [pinOpen, setPinOpen] = useState(false)

    const unlockResolver = useRef<((value: boolean) => void) | null>(null)
    const revalidateTimer = useRef<ReturnType<typeof setTimeout>>()

    const notify = useCallback((message: string, tone: Toast['tone'] = 'info') => {
        const id = Date.now() + Math.random()

        setToasts(current => [...current, { id, message, tone }])
        setTimeout(() => setToasts(current => current.filter(toast => toast.id !== id)), 4000)
    }, [])

    const dismissToast = useCallback((id: number) => {
        setToasts(current => current.filter(toast => toast.id !== id))
    }, [])

    const refresh = useCallback(async () => {
        try {
            const next = await apiGet<PlayerSnapshot>('/api/player')

            setSnapshot(next)
            setPatch({})
        } catch {
            // Kegagalan sesaat diabaikan; polling berikutnya akan mencoba lagi.
        }
    }, [])

    // Polling berhenti saat tab tidak terlihat, lalu menyusul begitu
    // pengguna kembali ke tab ini.
    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined

        const start = () => {
            if (timer) return
            timer = setInterval(refresh, POLL_INTERVAL_MS)
        }

        const stop = () => {
            if (!timer) return
            clearInterval(timer)
            timer = undefined
        }

        const onVisibility = () => {
            if (document.visibilityState === 'visible') {
                refresh()
                start()
            } else {
                stop()
            }
        }

        onVisibility()
        document.addEventListener('visibilitychange', onVisibility)

        return () => {
            stop()
            document.removeEventListener('visibilitychange', onVisibility)
        }
    }, [refresh])

    useEffect(() => () => clearTimeout(revalidateTimer.current), [])

    const scheduleRevalidate = useCallback(() => {
        clearTimeout(revalidateTimer.current)
        revalidateTimer.current = setTimeout(refresh, REVALIDATE_DELAY_MS)
    }, [refresh])

    const requestUnlock = useCallback(() => {
        if (unlocked) return Promise.resolve(true)

        setPinOpen(true)

        return new Promise<boolean>(resolve => {
            unlockResolver.current = resolve
        })
    }, [unlocked])

    const closePin = useCallback(() => {
        setPinOpen(false)
        unlockResolver.current?.(false)
        unlockResolver.current = null
    }, [])

    const submitPin = useCallback(async (pin: string) => {
        await apiPost('/api/auth/pin', { pin })

        setUnlocked(true)
        setPinOpen(false)
        unlockResolver.current?.(true)
        unlockResolver.current = null
    }, [])

    const lock = useCallback(async () => {
        await apiDelete('/api/auth/pin').catch(() => undefined)

        setUnlocked(false)
        notify('Kontrol dikunci kembali', 'info')
    }, [notify])

    const control = useCallback<PlayerContextValue['control']>(
        async (action, body = {}, options = {}) => {
            if (!unlocked && !(await requestUnlock())) {
                return false
            }

            if (options.patch) {
                setPatch(current => ({ ...current, ...options.patch }))
            }

            setPendingAction(action)

            const send = () => apiPost(`/api/control/${action}`, body)

            try {
                await send()
                scheduleRevalidate()
                return true
            } catch (error) {
                const apiError = error as ApiError

                if (apiError.code === 'PIN_REQUIRED') {
                    setUnlocked(false)

                    if (await requestUnlock()) {
                        try {
                            await send()
                            scheduleRevalidate()
                            return true
                        } catch (retryError) {
                            notify((retryError as ApiError).message, 'error')
                        }
                    }
                } else if (!options.silent) {
                    notify(apiError.message || 'Aksi gagal dijalankan', 'error')
                }

                setPatch({})
                refresh()
                return false
            } finally {
                setPendingAction(null)
            }
        },
        [notify, refresh, requestUnlock, scheduleRevalidate, unlocked],
    )

    const value = useMemo<PlayerContextValue>(
        () => ({
            snapshot,
            patch,
            devices: snapshot.devices,
            unlocked,
            pendingAction,
            toasts,
            pinOpen,
            control,
            refresh,
            notify,
            dismissToast,
            requestUnlock,
            submitPin,
            closePin,
            lock,
        }),
        [
            closePin,
            control,
            dismissToast,
            lock,
            notify,
            patch,
            pendingAction,
            pinOpen,
            refresh,
            requestUnlock,
            snapshot,
            submitPin,
            toasts,
            unlocked,
        ],
    )

    return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}
