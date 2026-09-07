import { ExternalUrls, Image, Tracks } from '.'
import { SpotifyUser } from './user'

export interface SpotifyPlaylist {
    collaborative: boolean
    description: string
    external_urls: ExternalUrls
    href: string
    id: string
    images: Image[]
    name: string
    owner: SpotifyUser
    primary_color: any
    public: boolean
    snapshot_id: string
    tracks: Tracks
    type: string
    uri: string
}
