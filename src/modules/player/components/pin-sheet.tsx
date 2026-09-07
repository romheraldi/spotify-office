'use client'
import { ApiError } from '@/lib/api-client'
import { CloseIcon, LockIcon } from '@/components/ui/icons'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { usePlayer } from '../player-context'

export default function PinSheet() {
    const { pinOpen, closePin, submitPin, notify } = usePlayer()
    const [pin, setPin] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!pinOpen) {
            setPin('')
            setError('')
            return
        }

        const timer = setTimeout(() => inputRef.current?.focus(), 60)
        const onKey = (event: KeyboardEvent) => event.key === 'Escape' && closePin()

        document.addEventListener('keydown', onKey)

        return () => {
            clearTimeout(timer)
            document.removeEventListener('keydown', onKey)
        }
    }, [pinOpen, closePin])

    if (!pinOpen) return null

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault()
        if (busy || !pin) return

        setBusy(true)
        setError('')

        try {
            await submitPin(pin)
            notify('Kontrol terbuka selama 12 jam', 'success')
        } catch (submitError) {
            const apiError = submitError as ApiError

            setError(apiError.message || 'PIN salah')
            setPin('')
            inputRef.current?.focus()
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
            <button
                type="button"
                aria-label="Tutup panel PIN"
                onClick={closePin}
                className="absolute inset-0 cursor-default bg-ink/25 backdrop-blur-sm"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="pin-title"
                className="glass-strong relative z-10 w-full animate-fade-up rounded-t-panel px-6 pb-8 pt-6 shadow-glass sm:max-w-md sm:rounded-panel"
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white">
                            <LockIcon className="h-5 w-5" />
                        </span>
                        <div>
                            <h2 id="pin-title" className="text-lg font-semibold">
                                Masukkan PIN kontrol
                            </h2>
                            <p className="text-sm text-ink-muted">Hanya untuk yang boleh mengubah pemutaran.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        aria-label="Tutup"
                        onClick={closePin}
                        className="text-ink-soft transition-colors hover:text-ink"
                    >
                        <CloseIcon className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="mt-6">
                    <input
                        ref={inputRef}
                        type="password"
                        inputMode="numeric"
                        autoComplete="off"
                        value={pin}
                        onChange={event => setPin(event.target.value)}
                        placeholder="PIN"
                        aria-invalid={!!error}
                        aria-describedby={error ? 'pin-error' : undefined}
                        className="w-full rounded-soft border border-white/70 bg-white/80 px-4 py-3 text-center text-xl tracking-[0.4em] text-ink outline-none transition-colors placeholder:tracking-normal placeholder:text-ink-soft focus:border-accent"
                    />

                    {error && (
                        <p id="pin-error" className="mt-3 text-center text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={busy || !pin}
                        className="mt-5 w-full rounded-full bg-ink py-3 font-medium text-white shadow-pill transition-colors hover:bg-black disabled:opacity-40"
                    >
                        {busy ? 'Memeriksa...' : 'Buka kontrol'}
                    </button>
                </form>
            </div>
        </div>
    )
}
