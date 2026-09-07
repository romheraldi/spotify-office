import dayjs from 'dayjs'
import { SpotifyData } from '../types'
import { topArtists } from './artists'
import { topGenres } from './genres'
import { userPlaylists } from './playlists'
import { topTracks } from './tracks'
import { currentUser } from './user'

let cacheData: SpotifyData
let cacheTTL: Date

export async function spotifyData(): Promise<SpotifyData> {
    if (cacheTTL > new Date() && cacheData) {
        return cacheData
    }

    const [artists, tracks, user, playlists] = await Promise.all([
        topArtists(),
        topTracks(),
        currentUser(),
        userPlaylists(),
    ])

    const genres = topGenres(artists)

    const data: SpotifyData = { artists, tracks, genres, user, playlists }

    cacheData = data
    cacheTTL = dayjs().add(3, 'hours').toDate()

    return data
}
