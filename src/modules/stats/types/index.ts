import { SpotifyArtist } from './artist'
import { SpotifyGenre } from './genre'
import { SpotifyPlaylist } from './playlist'
import { SpotifyTrack } from './track'
import { SpotifyUser } from './user'

export interface SpotifyData {
    artists: SpotifyArtist[]
    tracks: SpotifyTrack[]
    genres: SpotifyGenre[]
    user: SpotifyUser
    playlists: SpotifyPlaylist[]
}

export interface Tracks {
    href: string
    total: number
}

export interface ExternalUrls {
    spotify: string
}
export interface Image {
    height: number
    url: string
    width: number
}

export interface Followers {
    href: string
    total: number
}

export interface Image {
    height: number
    url: string
    width: number
}
