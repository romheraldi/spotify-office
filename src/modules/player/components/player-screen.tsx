'use client'
import { SpotifyData } from '@/modules/stats/types'
import StatsPanel from '@/modules/stats/components/stats-panel'
import GlassPanel from '@/components/ui/glass-panel'
import { useEffect, useState } from 'react'
import { PlayerProvider, usePlayer } from '../player-context'
import { PlayerSnapshot } from '../data/player'
import Backdrop from './backdrop'
import BottomBar from './bottom-bar'
import Header from './header'
import NowPlaying from './now-playing'
import PinSheet from './pin-sheet'
import PlaylistRail from './playlist-rail'
import PlaylistStrip from './playlist-strip'
import QueueList from './queue-list'
import Toaster from './toaster'

interface PlayerScreenProps {
    snapshot: PlayerSnapshot
    unlocked: boolean
    stats: SpotifyData | null
}

function Screen({ stats }: { stats: SpotifyData | null }) {
    const { snapshot, control, unlocked } = usePlayer()
    const [statsOpen, setStatsOpen] = useState(false)

    const track = snapshot.state?.item
    const playlists = stats?.playlists || []

    // Pintasan lama tetap dipertahankan: N melompat ke lagu berikutnya,
    // P membuka panel statistik.
    useEffect(() => {
        const onKeydown = (event: KeyboardEvent) => {
            if (!event.ctrlKey || !event.shiftKey || !event.altKey) return

            const key = event.key.toLowerCase()

            if (key === 'n') {
                event.preventDefault()
                control('next', { deviceId: snapshot.state?.device?.id })
            }

            if (key === 'p') {
                event.preventDefault()
                setStatsOpen(current => !current)
            }
        }

        document.addEventListener('keydown', onKeydown)
        return () => document.removeEventListener('keydown', onKeydown)
    }, [control, snapshot.state?.device?.id])

    return (
        <>
            <Backdrop imageUrl={track?.album.images[0]?.url} />
            <PlaylistRail playlists={playlists} />

            <main className="mx-auto flex min-h-screen w-full max-w-[1180px] flex-col justify-center px-4 py-6 md:py-10">
                <GlassPanel className="overflow-hidden">
                    <Header
                        userName={stats?.user.display_name}
                        userImage={stats?.user.images?.[0]?.url}
                        onOpenStats={() => setStatsOpen(true)}
                    />

                    {!snapshot.state && (
                        <p className="border-b border-white/60 px-6 py-3 text-sm text-ink-muted">
                            Tidak ada perangkat yang aktif. Buka Spotify di salah satu perangkat, lalu pilih perangkat
                            di kiri bawah.
                        </p>
                    )}

                    <div className="grid gap-8 px-4 py-6 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:px-8 md:py-8">
                        <NowPlaying />
                        <QueueList />
                    </div>

                    <BottomBar />
                </GlassPanel>

                <PlaylistStrip playlists={playlists} />

                {!unlocked && (
                    <p className="mt-4 text-center text-xs text-ink-soft">
                        Semua orang boleh melihat. Mengubah pemutaran perlu PIN.
                    </p>
                )}
            </main>

            {stats && <StatsPanel open={statsOpen} onClose={() => setStatsOpen(false)} data={stats} />}
            <PinSheet />
            <Toaster />
        </>
    )
}

export default function PlayerScreen({ snapshot, unlocked, stats }: PlayerScreenProps) {
    return (
        <PlayerProvider initialSnapshot={snapshot} initialUnlocked={unlocked}>
            <Screen stats={stats} />
        </PlayerProvider>
    )
}
