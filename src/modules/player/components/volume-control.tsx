'use client'
import IconButton from '@/components/ui/icon-button'
import Slider from '@/components/ui/slider'
import { MuteIcon, VolumeIcon } from '@/components/ui/icons'
import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '../player-context'

export default function VolumeControl({ className = '' }: { className?: string }) {
    const { snapshot, patch, control } = usePlayer()
    const device = snapshot.state?.device
    const volume = patch.volume ?? device?.volume_percent ?? 0
    const [open, setOpen] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout>>()

    useEffect(() => () => clearTimeout(timer.current), [])

    const supported = device?.supports_volume ?? false

    const commit = (next: number) => {
        clearTimeout(timer.current)
        timer.current = setTimeout(
            () => control('volume', { percent: next, deviceId: device?.id }, { patch: { volume: next } }),
            250,
        )
    }

    return (
        <div className={`flex items-center gap-2 ${className}`.trim()}>
            <IconButton
                label={supported ? 'Atur volume' : 'Perangkat ini tidak mendukung pengaturan volume'}
                size="sm"
                disabled={!supported}
                active={open}
                onClick={() => setOpen(current => !current)}
            >
                {volume === 0 ? <MuteIcon className="h-4 w-4" /> : <VolumeIcon className="h-4 w-4" />}
            </IconButton>

            <div
                className={`${open ? 'w-24 opacity-100' : 'w-0 opacity-0'} overflow-hidden transition-all duration-200`}
            >
                <Slider
                    label="Volume"
                    value={volume}
                    max={100}
                    disabled={!supported}
                    formatValue={value => `${Math.round(value)} persen`}
                    onCommit={commit}
                />
            </div>
        </div>
    )
}
