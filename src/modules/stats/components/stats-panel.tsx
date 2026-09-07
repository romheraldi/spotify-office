/* eslint-disable @next/next/no-img-element */
'use client'
import { CloseIcon } from '@/components/ui/icons'
import { formatArtists } from '@/lib/format'
import { useEffect, useState } from 'react'
import { SpotifyData } from '../types'
import GenreChart from './genre-chart'
import TrackPreviewButton from './track-preview-button'

interface StatsPanelProps {
    open: boolean
    onClose: () => void
    data: SpotifyData
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mt-8 first:mt-0">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{title}</h3>
            <div className="mt-3">{children}</div>
        </section>
    )
}

export default function StatsPanel({ open, onClose, data }: StatsPanelProps) {
    const [previewId, setPreviewId] = useState<string | null>(null)

    useEffect(() => {
        if (!open) {
            setPreviewId(null)
            return
        }

        const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()

        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, onClose])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-40 flex justify-end">
            <button
                type="button"
                aria-label="Tutup statistik"
                onClick={onClose}
                className="absolute inset-0 cursor-default bg-ink/25 backdrop-blur-sm"
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Statistik Spotify"
                className="glass-strong relative z-10 flex h-full w-full max-w-md animate-fade-up flex-col overflow-y-auto rounded-l-panel p-6 shadow-glass"
            >
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {data.user.images?.[0]?.url && (
                            <img
                                src={data.user.images[0].url}
                                alt=""
                                className="h-11 w-11 rounded-full object-cover ring-2 ring-white/80"
                            />
                        )}
                        <div>
                            <h2 className="text-lg font-semibold">{data.user.display_name}</h2>
                            <p className="text-sm text-ink-muted">Statistik 4 minggu terakhir</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-label="Tutup"
                        onClick={onClose}
                        className="text-ink-soft transition-colors hover:text-ink"
                    >
                        <CloseIcon className="h-5 w-5" />
                    </button>
                </div>

                <Section title="Genre teratas">
                    <GenreChart genres={data.genres} />
                </Section>

                <Section title="Artis teratas">
                    <ul className="grid grid-cols-3 gap-3">
                        {data.artists.slice(0, 6).map(artist => (
                            <li key={artist.id}>
                                <a
                                    href={artist.external_urls.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <img
                                        loading="lazy"
                                        src={artist.images?.[0]?.url}
                                        alt=""
                                        className="aspect-square w-full rounded-card object-cover shadow-card"
                                    />
                                    <p className="mt-2 truncate text-xs font-medium">{artist.name}</p>
                                </a>
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section title="Lagu teratas">
                    <ol className="space-y-1">
                        {data.tracks.slice(0, 10).map((track, index) => (
                            <li
                                key={track.id}
                                className="flex items-center gap-3 rounded-soft px-2 py-2 hover:bg-white/70"
                            >
                                <span className="w-4 text-xs tabular-nums text-ink-soft">{index + 1}</span>
                                <img
                                    loading="lazy"
                                    src={track.album.images.at(-1)?.url || track.album.images[0]?.url}
                                    alt=""
                                    className="h-10 w-10 rounded-lg object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <a
                                        href={track.external_urls.spotify}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block truncate text-sm font-medium hover:underline"
                                    >
                                        {track.name}
                                    </a>
                                    <p className="truncate text-xs text-ink-muted">
                                        {formatArtists(track.artists as { name: string }[])}
                                    </p>
                                </div>
                                {track.preview_url && (
                                    <TrackPreviewButton
                                        url={track.preview_url}
                                        name={track.name}
                                        playing={previewId === track.id}
                                        onToggle={() =>
                                            setPreviewId(current => (current === track.id ? null : track.id))
                                        }
                                    />
                                )}
                            </li>
                        ))}
                    </ol>
                </Section>
            </aside>
        </div>
    )
}
