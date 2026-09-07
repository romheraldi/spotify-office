import { SPOTIFY_USER_ID } from '@/config'
import { SpotifyUser } from '../types/user'
import spotify from '@/lib/spotify'

export async function currentUser(): Promise<SpotifyUser> {
    const spotifyId = SPOTIFY_USER_ID
    const res = await spotify.get(`/users/${spotifyId}`)
    return res.data
}
