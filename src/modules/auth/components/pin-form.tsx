'use client'
import { ApiError, apiPost } from '@/lib/api-client'
import { LockIcon } from '@/components/ui/icons'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function PinForm({ next = '/' }: { next?: string }) {
    const router = useRouter()
    const [pin, setPin] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault()
        if (busy || !pin) return

        setBusy(true)
        setError('')

        try {
            await apiPost('/api/auth/pin', { pin })
            router.replace(next)
            router.refresh()
        } catch (submitError) {
            setError((submitError as ApiError).message || 'PIN salah')
            setPin('')
            setBusy(false)
        }
    }

    return (
        <div className="glass w-full max-w-sm rounded-panel p-8 shadow-glass">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white">
                <LockIcon className="h-5 w-5" />
            </span>

            <h1 className="mt-5 text-2xl font-semibold">Buka kontrol pemutar</h1>
            <p className="mt-1.5 text-sm text-ink-muted">
                Semua orang boleh melihat pemutar. PIN hanya diperlukan untuk mengubah pemutaran.
            </p>

            <form onSubmit={onSubmit} className="mt-6">
                <label htmlFor="pin" className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    PIN kontrol
                </label>
                <input
                    id="pin"
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    autoFocus
                    value={pin}
                    onChange={event => setPin(event.target.value)}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'pin-error' : undefined}
                    className="mt-2 w-full rounded-soft border border-white/70 bg-white/80 px-4 py-3 text-center text-xl tracking-[0.4em] outline-none transition-colors focus:border-accent"
                />

                {error && (
                    <p id="pin-error" className="mt-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={busy || !pin}
                    className="mt-5 w-full rounded-full bg-ink py-3 font-medium text-white shadow-pill transition-colors hover:bg-black disabled:opacity-40"
                >
                    {busy ? 'Memeriksa...' : 'Masuk'}
                </button>
            </form>

            <a href="/" className="mt-4 block text-center text-sm text-ink-muted underline-offset-4 hover:underline">
                Lihat pemutar tanpa membuka kontrol
            </a>
        </div>
    )
}
