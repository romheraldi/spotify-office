import { SPOTIFY_USER_ID } from '@/config'
import spotify from '@/lib/spotify'
import { SpotifyPlaylist } from '../types/playlist'

export async function userPlaylists(): Promise<SpotifyPlaylist[]> {
    const res = await spotify.get<{ items: SpotifyPlaylist[] }>('/me/playlists', { params: { limit: 50 } })

    const playlists = res.data?.items || []

    // /me/playlists juga memuat playlist milik orang lain yang diikuti,
    // jadi disaring agar hanya playlist publik milik akun ini yang tampil.
    return playlists.filter(playlist => playlist.public && (!SPOTIFY_USER_ID || playlist.owner?.id === SPOTIFY_USER_ID))
}
