import { SPOTIFY_USER_ID } from '@/config'
import { SpotifyPlaylist } from '../types/playlist'
import spotify from '@/lib/spotify'

export async function userPlaylists(): Promise<SpotifyPlaylist[]> {
    const spotifyId = SPOTIFY_USER_ID
    const res = await spotify.get<{ items: SpotifyPlaylist[] }>(`/users/${spotifyId}/playlists`)

    const playlists = res.data?.items || []

    return playlists.filter(playlist => playlist.public)
}
