/* eslint-disable @next/next/no-img-element */
'use client'
import { SpotifyPlaylist } from '@/modules/stats/types/playlist'
import { usePlayer } from '../player-context'

interface PlaylistRailProps {
    playlists: SpotifyPlaylist[]
}

// Kartu playlist mengintip di tepi layar pada layar lebar, dan berubah
// menjadi baris yang bisa digeser pada layar kecil.
export default function PlaylistRail({ playlists }: PlaylistRailProps) {
    const { snapshot, control, notify } = usePlayer()
    const activeContext = snapshot.state?.context?.uri

    const playPlaylist = async (playlist: SpotifyPlaylist) => {
        const played = await control('play', {
            contextUri: playlist.uri,
            deviceId: snapshot.state?.device?.id,
        })

        if (played) notify(`Memutar ${playlist.name}`, 'success')
    }

    if (playlists.length === 0) return null

    // Dibagi rata ke kiri dan kanan, dan tiap sisi bisa digulir bila
    // playlistnya lebih banyak daripada tinggi layar.
    const half = Math.ceil(playlists.length / 2)
    const left = playlists.slice(0, half)
    const right = playlists.slice(half)

    const Card = ({ playlist, className = '' }: { playlist: SpotifyPlaylist; className?: string }) => (
        <button
            type="button"
            onClick={() => playPlaylist(playlist)}
            aria-current={playlist.uri === activeContext}
            className={`group relative block overflow-hidden rounded-card shadow-card transition-transform duration-200 hover:scale-[1.03] ${
                playlist.uri === activeContext ? 'ring-2 ring-accent' : ''
            } ${className}`.trim()}
        >
            <img
                loading="lazy"
                src={playlist.images?.[0]?.url || ''}
                alt={playlist.name}
                className="h-full w-full object-cover"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-left text-[11px] font-medium leading-tight text-white">
                {playlist.name}
            </span>
        </button>
    )

    return (
        <>
            <div className="pointer-events-none fixed inset-y-0 left-0 z-10 hidden items-center xl:flex">
                <div className="no-scrollbar pointer-events-auto flex max-h-[88vh] flex-col gap-3 overflow-y-auto py-4 pl-2">
                    {left.map(playlist => (
                        <div key={playlist.id} className="-ml-14 transition-all duration-200 hover:ml-0">
                            <Card playlist={playlist} className="h-24 w-28" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="pointer-events-none fixed inset-y-0 right-0 z-10 hidden items-center xl:flex">
                <div className="no-scrollbar pointer-events-auto flex max-h-[88vh] flex-col gap-3 overflow-y-auto py-4 pr-2">
                    {right.map(playlist => (
                        <div key={playlist.id} className="-mr-14 transition-all duration-200 hover:mr-0">
                            <Card playlist={playlist} className="h-24 w-28" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
