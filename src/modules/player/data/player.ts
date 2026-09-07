import spotify from '@/lib/spotify'
import { DeviceData, PlaybackData } from '../types/playback'
import { QueueData } from '../types/queue'

export interface PlayerSnapshot {
    state: PlaybackData | null
    queue: QueueData['queue']
    devices: DeviceData[]
}

async function playbackState(): Promise<PlaybackData | null> {
    const res = await spotify.get<PlaybackData | ''>('/me/player')

    // Spotify membalas 204 tanpa isi ketika tidak ada pemutaran aktif.
    return res.data || null
}

async function playbackQueue(): Promise<QueueData['queue']> {
    try {
        const res = await spotify.get<QueueData>('/me/player/queue')
        return res.data?.queue || []
    } catch {
        return []
    }
}

export async function getDevices(): Promise<DeviceData[]> {
    try {
        const res = await spotify.get<{ devices: DeviceData[] }>('/me/player/devices')
        return res.data?.devices || []
    } catch {
        return []
    }
}

export async function getPlayerSnapshot(): Promise<PlayerSnapshot> {
    const [state, queue, devices] = await Promise.all([playbackState(), playbackQueue(), getDevices()])

    return { state, queue, devices }
}
