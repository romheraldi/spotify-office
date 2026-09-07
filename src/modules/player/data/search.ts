import spotify from '@/lib/spotify'
import { SearchResponse, Track } from '../types/search'

const BLOCKED_ARTIST_IDS = ['0zuIBB0gRxp4i4E2gvrcoM', '0NbKRRBuiIUwS9irPvi7wD']

export function filterBlockedTracks(tracks: Track[], blockedIds: string[] = BLOCKED_ARTIST_IDS): Track[] {
    return tracks.filter(track => !track?.artists?.some(artist => blockedIds.includes(artist?.id)))
}

export async function searchTrack(search: string): Promise<Track[]> {
    const res = await spotify.get<SearchResponse>('/search', {
        params: {
            q: search,
            type: 'track',
            market: 'id',
            limit: 8,
            offset: 0,
        },
    })

    return filterBlockedTracks(res.data?.tracks?.items || [])
}
