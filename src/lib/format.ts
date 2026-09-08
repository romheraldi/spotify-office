export function formatDuration(ms: number) {
    const safe = Math.max(0, Math.floor(ms / 1000))
    const minutes = Math.floor(safe / 60)
    const seconds = safe % 60

    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function formatArtists(artists?: { name: string }[]) {
    return (artists || []).map(artist => artist.name).join(', ')
}

export function releaseYear(releaseDate?: string) {
    return releaseDate?.slice(0, 4) || ''
}

export function formatWait(ms: number) {
    const minutes = Math.ceil(ms / 60_000)

    if (minutes < 60) return `${minutes} menit`

    const hours = Math.floor(minutes / 60)
    const rest = minutes % 60

    return rest ? `${hours} jam ${rest} menit` : `${hours} jam`
}
