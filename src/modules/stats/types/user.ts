import { ExternalUrls, Followers, Image } from '.'

export interface SpotifyUser {
    display_name: string
    external_urls: ExternalUrls
    followers: Followers[]
    href: string
    id: string
    images: Image[]
    type: string
    uri: string
}

export interface User {
    displayName: string
    followers: Followers[]
    externalUrl: ExternalUrls
    id: string
    image: Image
    type: string
    uri: string
}
