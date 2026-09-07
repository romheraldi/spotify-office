import { NextResponse } from 'next/server'

export interface ApiError {
    code: string
    message: string
}

export interface ApiResponse<T> {
    ok: boolean
    data?: T
    error?: ApiError
}

export function ok<T>(data?: T, init?: ResponseInit) {
    return NextResponse.json<ApiResponse<T>>({ ok: true, data }, { status: 200, ...init })
}

export function fail(code: string, message: string, status = 400, init?: ResponseInit) {
    return NextResponse.json<ApiResponse<never>>({ ok: false, error: { code, message } }, { status, ...init })
}

interface SpotifyLikeError {
    response?: { status?: number; data?: { error?: { message?: string } } }
    message?: string
}

// Menerjemahkan kegagalan panggilan Spotify menjadi kode yang bisa
// ditindaklanjuti oleh antarmuka.
export function failFromSpotify(error: unknown) {
    const spotifyError = error as SpotifyLikeError
    const status = spotifyError?.response?.status
    const detail = spotifyError?.response?.data?.error?.message || spotifyError?.message || 'Terjadi kesalahan'

    if (status === 404) {
        return fail('NO_ACTIVE_DEVICE', 'Tidak ada perangkat Spotify yang aktif', 409)
    }

    if (status === 403) {
        return fail('PREMIUM_REQUIRED', 'Kontrol playback memerlukan akun Spotify Premium', 403)
    }

    if (status === 401) {
        return fail('SPOTIFY_TOKEN_EXPIRED', 'Sesi Spotify kantor kedaluwarsa, perlu otorisasi ulang', 502)
    }

    if (status === 429) {
        return fail('SPOTIFY_RATE_LIMITED', 'Spotify sedang membatasi permintaan, coba sebentar lagi', 429)
    }

    return fail('SPOTIFY_ERROR', detail, 502)
}
