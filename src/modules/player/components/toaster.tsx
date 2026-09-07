'use client'
import { CloseIcon } from '@/components/ui/icons'
import { usePlayer } from '../player-context'

const tones = {
    info: 'text-ink',
    success: 'text-accent-deep',
    error: 'text-red-600',
}

export default function Toaster() {
    const { toasts, dismissToast } = usePlayer()

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    role="status"
                    className={`glass-strong pointer-events-auto flex max-w-md animate-fade-up items-center gap-3 rounded-full px-4 py-2.5 text-sm shadow-glass ${tones[toast.tone]}`}
                >
                    <span>{toast.message}</span>
                    <button
                        type="button"
                        aria-label="Tutup pesan"
                        onClick={() => dismissToast(toast.id)}
                        className="text-ink-soft transition-colors hover:text-ink"
                    >
                        <CloseIcon className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    )
}
