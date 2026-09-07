import { SpotifyArtist } from '../types/artist'
import { SpotifyGenre } from '../types/genre'

export function topGenres(artists: SpotifyArtist[]): SpotifyGenre[] {
    const genreMap: Record<string, SpotifyGenre> = {}

    artists.forEach(artist => {
        artist.genres.forEach(genre => {
            if (!genreMap[genre]) {
                genreMap[genre] = { name: genre, total: 1, percentage: 0 }
            } else {
                genreMap[genre].total += 1
            }
        })
    })

    const genres = Object.values(genreMap)

    const sortedGenres = genres.sort((a, b) => {
        if (b.total === a.total) {
            return a.name.localeCompare(b.name)
        }
        return b.total - a.total
    })

    const topGenres = sortedGenres.slice(0, 5)

    const totalArtistInGenres = topGenres.reduce((total, genre) => total + genre.total, 0)

    topGenres.forEach(genre => {
        genre.percentage = +((genre.total / totalArtistInGenres) * 100).toFixed(2)
    })

    return topGenres
}
