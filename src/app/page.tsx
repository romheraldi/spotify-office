import { APP_URL, SPOTIFY_USER_ID } from '@/config'
import { isUnlocked } from '@/modules/auth/guard'
import PlayerScreen from '@/modules/player/components/player-screen'
import { getPlayerSnapshot } from '@/modules/player/data/player'
import { spotifyData } from '@/modules/stats/data'
import { Metadata, ResolvingMetadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
    const data = await spotifyData().catch(() => null)
    const previousImages = (await parent).openGraph?.images || []

    if (!data) {
        return { title: 'Pemutar Spotify Kantor' }
    }

    const title = `Pemutar Spotify ${data.user.display_name}`
    const description = `Lihat lagu yang sedang diputar, antrian, dan statistik Spotify ${data.user.display_name}.`
    const images = [data.user.images[0]?.url, ...previousImages].filter(Boolean)

    return {
        title,
        description,
        openGraph: { title, description, images, type: 'website', url: APP_URL },
        twitter: { card: 'summary_large_image', title, description, images },
        icons: data.user.images[0]?.url,
    }
}

export default async function Home() {
    const [snapshot, stats] = await Promise.all([
        getPlayerSnapshot().catch(() => ({ state: null, queue: [], devices: [] })),
        spotifyData().catch(() => null),
    ])

    if (!stats && !snapshot.state) {
        const spotifyLink = `https://open.spotify.com/user/${SPOTIFY_USER_ID}`

        return (
            <main className="flex min-h-screen items-center justify-center px-6 text-center">
                <div className="glass rounded-panel px-8 py-10 shadow-glass">
                    <h1 className="text-2xl font-semibold">Data Spotify belum bisa diambil</h1>
                    <p className="mt-2 max-w-sm text-sm text-ink-muted">
                        Periksa kembali kredensial Spotify di server, lalu muat ulang halaman ini.
                    </p>
                    <a
                        href={spotifyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white"
                    >
                        Buka profil Spotify
                    </a>
                </div>
            </main>
        )
    }

    return <PlayerScreen snapshot={snapshot} unlocked={isUnlocked()} stats={stats} />
}
