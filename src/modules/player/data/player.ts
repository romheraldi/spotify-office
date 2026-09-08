import spotify from '@/lib/spotify'
import { DeviceData, PlaybackData } from '../types/playback'
import { QueueData } from '../types/queue'

export interface PlayerSnapshot {
    state: PlaybackData | null
    queue: QueueData['queue']
    devices: DeviceData[]
    // Diisi ketika data yang dikembalikan berasal dari simpanan lama karena
    // Spotify sedang membatasi permintaan.
    stale?: boolean
    retryAfterMs?: number
}

// Umur simpanan tiap jenis data. Status pemutaran berubah tiap detik,
// antrian hanya berubah saat lagu berganti, dan daftar perangkat nyaris
// tidak pernah berubah. Membedakan ketiganya memangkas jumlah permintaan
// ke Spotify secara drastis.
const STATE_TTL_MS = 2500
const QUEUE_TTL_MS = 15_000
const DEVICES_TTL_MS = 60_000

interface Cache<T> {
    value: T
    at: number
}

let stateCache: Cache<PlaybackData | null> | undefined
let queueCache: Cache<QueueData['queue']> | undefined
let devicesCache: Cache<DeviceData[]> | undefined
let queueTrackId: string | undefined

// Satu janji yang sedang berjalan dipakai bersama, sehingga sepuluh tab
// yang meminta bersamaan tetap menghasilkan satu panggilan ke Spotify.
let inflight: Promise<PlayerSnapshot> | undefined

let rateLimitedUntil = 0

function fresh<T>(cache: Cache<T> | undefined, ttl: number) {
    return cache && Date.now() - cache.at < ttl
}

function noteError(error: unknown) {
    const response = (error as { response?: { status?: number; headers?: Record<string, string> } })?.response

    if (response?.status !== 429) return

    const retryAfter = Number(response.headers?.['retry-after'])
    const waitMs = Number.isFinite(retryAfter) ? retryAfter * 1000 : 60_000

    rateLimitedUntil = Date.now() + waitMs
}

async function readState(): Promise<PlaybackData | null> {
    if (fresh(stateCache, STATE_TTL_MS)) return stateCache!.value

    try {
        const res = await spotify.get<PlaybackData | ''>('/me/player')

        // Spotify membalas 204 tanpa isi ketika tidak ada pemutaran aktif.
        stateCache = { value: res.data || null, at: Date.now() }
    } catch (error) {
        noteError(error)

        if (!stateCache) throw error
    }

    return stateCache!.value
}

async function readQueue(trackId?: string): Promise<QueueData['queue']> {
    const sameTrack = queueTrackId === trackId

    if (sameTrack && fresh(queueCache, QUEUE_TTL_MS)) return queueCache!.value

    try {
        const res = await spotify.get<QueueData>('/me/player/queue')

        queueCache = { value: res.data?.queue || [], at: Date.now() }
        queueTrackId = trackId
    } catch (error) {
        noteError(error)
    }

    return queueCache?.value || []
}

export async function getDevices(): Promise<DeviceData[]> {
    if (fresh(devicesCache, DEVICES_TTL_MS)) return devicesCache!.value

    try {
        const res = await spotify.get<{ devices: DeviceData[] }>('/me/player/devices')

        devicesCache = { value: res.data?.devices || [], at: Date.now() }
    } catch (error) {
        noteError(error)
    }

    return devicesCache?.value || []
}

function lastKnownSnapshot(): PlayerSnapshot {
    return {
        state: stateCache?.value ?? null,
        queue: queueCache?.value || [],
        devices: devicesCache?.value || [],
        stale: true,
        retryAfterMs: Math.max(0, rateLimitedUntil - Date.now()),
    }
}

async function loadSnapshot(): Promise<PlayerSnapshot> {
    const state = await readState()

    // Antrian dan daftar perangkat diambil berurutan setelah status, dan
    // hanya bila simpanannya sudah kedaluwarsa.
    const queue = await readQueue(state?.item?.id)
    const devices = await getDevices()

    return { state, queue, devices }
}

export async function getPlayerSnapshot(): Promise<PlayerSnapshot> {
    if (Date.now() < rateLimitedUntil) {
        return lastKnownSnapshot()
    }

    if (!inflight) {
        inflight = loadSnapshot().finally(() => {
            inflight = undefined
        })
    }

    try {
        return await inflight
    } catch (error) {
        if (stateCache || queueCache || devicesCache) return lastKnownSnapshot()

        throw error
    }
}
