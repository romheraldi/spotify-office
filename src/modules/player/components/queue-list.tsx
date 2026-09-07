/* eslint-disable @next/next/no-img-element */
'use client'
import { formatArtists, formatDuration, releaseYear } from '@/lib/format'
import { PlayIcon } from '@/components/ui/icons'
import { usePlayer } from '../player-context'

function PopularityDots({ value }: { value: number }) {
    const filled = Math.round((value / 100) * 5)

    return (
        <div className="flex items-center gap-1" title={`Popularitas ${value} dari 100`}>
            {[0, 1, 2, 3, 4].map(index => (
                <span
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full ${index < filled ? 'bg-ink' : 'bg-ink/20'}`}
                    aria-hidden="true"
                />
            ))}
        </div>
    )
}

export default function QueueList() {
    const { snapshot, control } = usePlayer()
    const state = snapshot.state
    const track = state?.item
    const queue = snapshot.queue

    if (!track) {
        return (
            <div className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-3 text-center">
                <p className="text-lg font-medium">Belum ada yang diputar</p>
                <p className="max-w-xs text-sm text-ink-muted">
                    Pilih salah satu playlist di tepi layar untuk mulai memutar musik kantor.
                </p>
            </div>
        )
    }

    const year = releaseYear(track.album.release_date)

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="truncate text-3xl font-semibold tracking-tight md:text-4xl">{track.name}</h1>
                    <p className="mt-1.5 truncate text-sm text-ink-muted">
                        {[formatArtists(track.artists), year, `${queue.length + 1} lagu di antrian`]
                            .filter(Boolean)
                            .join(' · ')}
                    </p>
                </div>

                <div className="shrink-0 text-right">
                    <p className="text-2xl font-semibold tabular-nums">
                        {(track.popularity / 20).toFixed(1)}
                        <span className="text-base font-normal text-ink-soft">/5</span>
                    </p>
                    <div className="mt-1.5 flex justify-end">
                        <PopularityDots value={track.popularity} />
                    </div>
                </div>
            </div>

            <ol className="no-scrollbar mt-6 max-h-[22rem] flex-1 space-y-1 overflow-y-auto pr-1">
                <li className="flex items-center gap-3 rounded-[16px] bg-ink px-4 py-3 text-white shadow-pill">
                    <PlayIcon className="h-4 w-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{track.name}</p>
                        <p className="truncate text-xs text-white/60">{formatArtists(track.artists)}</p>
                    </div>
                    <span className="text-xs tabular-nums text-white/70">{formatDuration(track.duration_ms)}</span>
                </li>

                {queue.map((item, index) => (
                    <li key={`${item.id}-${index}`}>
                        <button
                            type="button"
                            onClick={() => control('play', { uri: item.uri, deviceId: state?.device?.id })}
                            className="flex w-full items-center gap-3 rounded-[16px] px-4 py-2.5 text-left transition-colors hover:bg-white/70"
                        >
                            <span className="w-4 shrink-0 text-xs tabular-nums text-ink-soft">{index + 2}</span>
                            <img
                                loading="lazy"
                                src={item.album.images.at(-1)?.url || item.album.images[0]?.url}
                                alt=""
                                className="h-9 w-9 shrink-0 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm">{item.name}</p>
                                <p className="truncate text-xs text-ink-muted">{formatArtists(item.artists)}</p>
                            </div>
                            <span className="hidden text-xs tabular-nums text-ink-soft sm:inline">
                                {formatDuration(item.duration_ms)}
                            </span>
                        </button>
                    </li>
                ))}

                {queue.length === 0 && (
                    <li className="px-4 py-6 text-sm text-ink-muted">
                        Antrian kosong. Cari lagu di kolom pencarian untuk menambah.
                    </li>
                )}
            </ol>
        </div>
    )
}
