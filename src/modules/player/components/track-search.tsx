/* eslint-disable @next/next/no-img-element */
'use client'
import { ApiError, apiGet } from '@/lib/api-client'
import { formatArtists, formatDuration } from '@/lib/format'
import IconButton from '@/components/ui/icon-button'
import { PlusIcon, SearchIcon } from '@/components/ui/icons'
import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '../player-context'
import { Track } from '../types/search'

const DEBOUNCE_MS = 300

export default function TrackSearch() {
    const { snapshot, unlocked, control, requestUnlock, notify } = usePlayer()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Track[]>([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const term = query.trim()

        if (!term || !unlocked) {
            setResults([])
            setLoading(false)
            return
        }

        setLoading(true)
        const controller = new AbortController()
        const timer = setTimeout(async () => {
            try {
                setResults(
                    await apiGet<Track[]>(`/api/search?q=${encodeURIComponent(term)}`, {
                        signal: controller.signal,
                    }),
                )
            } catch (error) {
                if ((error as ApiError).code === 'PIN_REQUIRED') {
                    requestUnlock()
                }
            } finally {
                setLoading(false)
            }
        }, DEBOUNCE_MS)

        return () => {
            controller.abort()
            clearTimeout(timer)
        }
    }, [query, unlocked, requestUnlock])

    useEffect(() => {
        const onClickOutside = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', onClickOutside)
        return () => document.removeEventListener('mousedown', onClickOutside)
    }, [])

    const addToQueue = async (track: Track) => {
        const added = await control('queue', { uri: track.uri, deviceId: snapshot.state?.device?.id })

        if (added) {
            notify(`${track.name} masuk antrian`, 'success')
            setQuery('')
            setResults([])
            setOpen(false)
        }
    }

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            <div className="flex items-center gap-2 rounded-full bg-white/55 px-4 py-2.5 transition-colors focus-within:bg-white/80">
                <SearchIcon className="h-4 w-4 shrink-0 text-ink-soft" />
                <input
                    value={query}
                    onFocus={() => {
                        setOpen(true)
                        if (!unlocked) requestUnlock()
                    }}
                    onChange={event => {
                        setQuery(event.target.value)
                        setOpen(true)
                    }}
                    placeholder="Cari lagu, artis, album..."
                    aria-label="Cari lagu untuk ditambahkan ke antrian"
                    className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
                />
            </div>

            {open && !!query.trim() && (
                <div className="glass-strong absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-[22rem] overflow-y-auto rounded-card p-2 shadow-glass">
                    {!unlocked && (
                        <p className="px-3 py-4 text-sm text-ink-muted">Buka kontrol dengan PIN untuk mencari lagu.</p>
                    )}

                    {unlocked && loading && <p className="px-3 py-4 text-sm text-ink-muted">Mencari...</p>}

                    {unlocked && !loading && results.length === 0 && (
                        <p className="px-3 py-4 text-sm text-ink-muted">Tidak ada lagu yang cocok.</p>
                    )}

                    {results.map(track => (
                        <div
                            key={track.id}
                            className="flex items-center gap-3 rounded-soft px-2 py-2 transition-colors hover:bg-white/70"
                        >
                            <img
                                loading="lazy"
                                src={track.album.images.at(-1)?.url || track.album.images[0]?.url}
                                alt=""
                                className="h-11 w-11 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{track.name}</p>
                                <p className="truncate text-xs text-ink-muted">{formatArtists(track.artists)}</p>
                            </div>
                            <span className="text-xs tabular-nums text-ink-soft">
                                {formatDuration(track.duration_ms)}
                            </span>
                            <IconButton
                                label={`Tambahkan ${track.name} ke antrian`}
                                size="sm"
                                tone="accent"
                                onClick={() => addToQueue(track)}
                            >
                                <PlusIcon className="h-4 w-4" />
                            </IconButton>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
