/* eslint-disable @next/next/no-img-element */
'use client'
import { SpotifyPlaylist } from '@/modules/stats/types/playlist'
import { usePlayer } from '../player-context'

// Versi layar kecil dari pemilih playlist: baris yang bisa digeser,
// diletakkan di bawah panel pemutar.
export default function PlaylistStrip({ playlists }: { playlists: SpotifyPlaylist[] }) {
    const { snapshot, control, notify } = usePlayer()
    const activeContext = snapshot.state?.context?.uri

    if (playlists.length === 0) return null

    return (
        <section className="mt-6 xl:hidden">
            <h2 className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Playlist kantor</h2>

            <div className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
                {playlists.map(playlist => (
                    <button
                        key={playlist.id}
                        type="button"
                        aria-current={playlist.uri === activeContext}
                        onClick={async () => {
                            const played = await control('play', {
                                contextUri: playlist.uri,
                                deviceId: snapshot.state?.device?.id,
                            })

                            if (played) notify(`Memutar ${playlist.name}`, 'success')
                        }}
                        className={`relative block h-28 w-28 shrink-0 overflow-hidden rounded-card shadow-card ${
                            playlist.uri === activeContext ? 'ring-2 ring-accent' : ''
                        }`}
                    >
                        <img
                            loading="lazy"
                            src={playlist.images?.[0]?.url || ''}
                            alt={playlist.name}
                            className="h-full w-full object-cover"
                        />
                        <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/75 to-transparent p-1.5 text-left text-[11px] font-medium leading-tight text-white">
                            {playlist.name}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    )
}
