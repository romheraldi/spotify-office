import spotify from '@/lib/spotify'
import { SpotifyPlaylist } from '../types/playlist'

// Seluruh isi perpustakaan akun kantor ditampilkan apa adanya: yang privat
// maupun yang dibuat akun lain lalu diikuti akun ini.
export async function userPlaylists(): Promise<SpotifyPlaylist[]> {
    const res = await spotify.get<{ items: SpotifyPlaylist[] }>('/me/playlists', { params: { limit: 50 } })

    return (res.data?.items || []).filter(Boolean)
}
