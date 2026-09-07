import { ExternalUrls, Image } from '.'
import { SpotifyAlbum } from './album'
import { SpotifyArtist } from './artist'

export interface SpotifyTrack {
    album: SpotifyAlbum
    artists: Partial<SpotifyArtist>[]
    available_markets?: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: ExternalIds
    external_urls: ExternalUrls
    href: string
    id: string
    is_local: boolean
    name: string
    popularity: number
    preview_url: string
    track_number: number
    type: string
    uri: string
}

export interface ExternalIds {
    isrc: string
}
