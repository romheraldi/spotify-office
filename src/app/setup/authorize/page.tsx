import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '@/config'
import { isUnlocked } from '@/modules/auth/guard'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Otorisasi ulang Spotify',
}

const SCOPES = [
    'user-read-currently-playing',
    'user-top-read',
    'user-read-recently-played',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-playback-state',
    'user-modify-playback-state',
]

// Halaman ini hanya dipakai pemilik ketika refresh token perlu dibuat ulang,
// jadi ditutup dengan PIN yang sama seperti kontrol pemutaran.
export default function Authorize() {
    if (!isUnlocked()) {
        redirect('/login?next=/setup/authorize')
    }

    const query = new URLSearchParams({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID || '',
        scope: SCOPES.join(' '),
        redirect_uri: SPOTIFY_REDIRECT_URI || '',
        state: 'setup',
    })

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="glass w-full max-w-md rounded-panel p-8 shadow-glass">
                <h1 className="text-2xl font-semibold">Otorisasi ulang Spotify</h1>
                <p className="mt-2 text-sm text-ink-muted">
                    Lanjutkan hanya bila refresh token kantor sudah tidak berlaku. Setelah menyetujui izin di Spotify,
                    token baru akan ditampilkan untuk disalin ke environment server.
                </p>

                <a
                    href={`https://accounts.spotify.com/authorize?${query.toString()}`}
                    className="mt-6 inline-block rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-pill transition-colors hover:bg-black"
                >
                    Lanjutkan ke Spotify
                </a>
            </div>
        </main>
    )
}
