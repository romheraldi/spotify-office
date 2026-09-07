import { useEffect, useRef, useState } from 'react'

interface ProgressInput {
    progressMs: number
    durationMs: number
    isPlaying: boolean
    trackId?: string
}

// Progres diinterpolasi secara lokal agar bar bergerak halus meski data
// dari server hanya masuk setiap beberapa detik.
export default function useProgress({ progressMs, durationMs, isPlaying, trackId }: ProgressInput) {
    const [progress, setProgress] = useState(progressMs)
    const anchor = useRef({ at: Date.now(), value: progressMs })

    useEffect(() => {
        anchor.current = { at: Date.now(), value: progressMs }
        setProgress(progressMs)
    }, [progressMs, trackId])

    useEffect(() => {
        if (!isPlaying) return

        const id = setInterval(() => {
            const elapsed = Date.now() - anchor.current.at
            setProgress(Math.min(durationMs, anchor.current.value + elapsed))
        }, 250)

        return () => clearInterval(id)
    }, [isPlaying, durationMs, trackId])

    return Math.min(progress, durationMs)
}
