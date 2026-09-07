'use client'
import IconButton from '@/components/ui/icon-button'
import { PauseIcon, PlayIcon } from '@/components/ui/icons'
import { useEffect, useRef } from 'react'

interface TrackPreviewButtonProps {
    url: string
    name: string
    playing: boolean
    onToggle: () => void
}

// Cuplikan 30 detik dari Spotify. Hanya satu cuplikan yang boleh berbunyi,
// jadi pemutarannya dikendalikan oleh induk lewat prop playing.
export default function TrackPreviewButton({ url, name, playing, onToggle }: TrackPreviewButtonProps) {
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        if (playing) {
            audio.currentTime = 0
            audio.play().catch(() => undefined)
        } else {
            audio.pause()
        }
    }, [playing])

    return (
        <>
            <IconButton
                label={playing ? `Hentikan cuplikan ${name}` : `Dengar cuplikan ${name}`}
                size="sm"
                tone={playing ? 'accent' : 'ghost'}
                onClick={onToggle}
            >
                {playing ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
            </IconButton>
            <audio ref={audioRef} src={url} preload="none" onEnded={onToggle} className="hidden" />
        </>
    )
}
