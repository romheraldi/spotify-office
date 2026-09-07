import { describe, expect, it } from 'vitest'
import { filterBlockedTracks } from './search'
import { Track } from '../types/search'

function track(id: string, artistIds: string[]) {
    return { id, name: id, artists: artistIds.map(artistId => ({ id: artistId })) } as unknown as Track
}

describe('filterBlockedTracks', () => {
    const blocked = ['artis-blokir', 'artis-blokir-2']

    it('membuang track dari artis yang diblokir', () => {
        const tracks = [track('a', ['artis-bebas']), track('b', ['artis-blokir'])]

        expect(filterBlockedTracks(tracks, blocked).map(item => item.id)).toEqual(['a'])
    })

    it('tetap menyaring saat dua track berurutan diblokir', () => {
        const tracks = [
            track('a', ['artis-blokir']),
            track('b', ['artis-blokir-2']),
            track('c', ['artis-bebas']),
            track('d', ['artis-blokir']),
        ]

        expect(filterBlockedTracks(tracks, blocked).map(item => item.id)).toEqual(['c'])
    })

    it('membuang track yang salah satu artis kolaborasinya diblokir', () => {
        const tracks = [track('a', ['artis-bebas', 'artis-blokir'])]

        expect(filterBlockedTracks(tracks, blocked)).toEqual([])
    })

    it('aman terhadap track tanpa daftar artis', () => {
        const tracks = [{ id: 'a' } as unknown as Track]

        expect(filterBlockedTracks(tracks, blocked).map(item => item.id)).toEqual(['a'])
    })
})
