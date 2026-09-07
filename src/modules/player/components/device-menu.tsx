'use client'
import { CheckIcon, DeviceIcon } from '@/components/ui/icons'
import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '../player-context'

export default function DeviceMenu() {
    const { snapshot, control, unlocked, requestUnlock } = usePlayer()
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const active = snapshot.state?.device
    const devices = snapshot.devices

    useEffect(() => {
        const onClickOutside = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
        }

        document.addEventListener('mousedown', onClickOutside)
        return () => document.removeEventListener('mousedown', onClickOutside)
    }, [])

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={async () => {
                    if (!unlocked && !(await requestUnlock())) return
                    setOpen(current => !current)
                }}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="flex items-center gap-2.5 rounded-full bg-white/60 px-3 py-2 text-left transition-colors hover:bg-white/90"
            >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white">
                    <DeviceIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                    <span className="block max-w-[9rem] truncate text-sm font-medium">
                        {active?.name || 'Tanpa perangkat'}
                    </span>
                    <span className="block text-xs capitalize text-ink-soft">{active?.type || 'pilih perangkat'}</span>
                </span>
            </button>

            {open && (
                <div
                    role="listbox"
                    className="glass-strong absolute bottom-[calc(100%+8px)] left-0 z-30 w-64 rounded-card p-2 shadow-glass"
                >
                    {devices.length === 0 && (
                        <p className="px-3 py-3 text-sm text-ink-muted">
                            Tidak ada perangkat. Buka Spotify di salah satu perangkat lebih dulu.
                        </p>
                    )}

                    {devices.map(device => (
                        <button
                            key={device.id}
                            type="button"
                            role="option"
                            aria-selected={device.is_active}
                            onClick={async () => {
                                setOpen(false)
                                await control('device', { deviceId: device.id })
                            }}
                            className="flex w-full items-center gap-3 rounded-soft px-3 py-2.5 text-left transition-colors hover:bg-white/70"
                        >
                            <DeviceIcon className="h-4 w-4 shrink-0 text-ink-muted" />
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm">{device.name}</span>
                                <span className="block text-xs capitalize text-ink-soft">{device.type}</span>
                            </span>
                            {device.is_active && <CheckIcon className="h-4 w-4 shrink-0 text-accent-deep" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
