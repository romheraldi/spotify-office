interface Album {
    album_type: string
    total_tracks: number
    available_markets: string[]
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    images: {
        url: string
        height: number
        width: number
    }[]
    name: string
    release_date: string
    release_date_precision: string
    restrictions: {
        reason: string
    }
    type: string
    uri: string
    artists: {
        external_urls: {
            spotify: string
        }
        href: string
        id: string
        name: string
        type: string
        uri: string
    }[]
}

interface Artist {
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    name: string
    type: string
    uri: string
}

interface Track {
    album: Album
    artists: Artist[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: {
        isrc: string
        ean: string
        upc: string
    }
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    is_playable: boolean
    linked_from: any // Update this type if you have more information about the linked_from property
    restrictions: {
        reason: string
    }
    name: string
    popularity: number
    preview_url: string
    track_number: number
    type: string
    uri: string
    is_local: boolean
}

export interface QueueData {
    currently_playing: Track
    queue: Track[]
}
