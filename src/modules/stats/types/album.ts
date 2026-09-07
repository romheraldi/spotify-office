import { ExternalUrls, Image } from '.'
import { SpotifyArtist } from './artist'

export interface SpotifyAlbum {
    album_type: string
    artists: Partial<SpotifyArtist>[]
    available_markets?: string[]
    external_urls: ExternalUrls
    href: string
    id: string
    images: Image[]
    name: string
    release_date: string
    release_date_precision: string
    total_tracks: number
    type: string
    uri: string
}
