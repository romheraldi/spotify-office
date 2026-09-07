import spotify from '@/lib/spotify'

export type RepeatState = 'off' | 'context' | 'track'

// device_id hanya dikirim bila benar-benar ada isinya, agar perilaku
// tanpa parameter tetap mengenai perangkat yang sedang aktif.
function deviceParams(deviceId?: string) {
    return { params: { device_id: deviceId || undefined } }
}

export async function play(options: { deviceId?: string; contextUri?: string; uri?: string } = {}) {
    const { deviceId, contextUri, uri } = options

    await spotify.put(
        '/me/player/play',
        {
            context_uri: uri ? undefined : contextUri || undefined,
            uris: uri ? [uri] : undefined,
            position_ms: 0,
        },
        deviceParams(deviceId),
    )
}

export async function resume(deviceId?: string) {
    await spotify.put('/me/player/play', undefined, deviceParams(deviceId))
}

export async function pause(deviceId?: string) {
    await spotify.put('/me/player/pause', undefined, deviceParams(deviceId))
}

export async function next(deviceId?: string) {
    await spotify.post('/me/player/next', undefined, deviceParams(deviceId))
}

export async function previous(deviceId?: string) {
    await spotify.post('/me/player/previous', undefined, deviceParams(deviceId))
}

export async function seek(positionMs: number, deviceId?: string) {
    await spotify.put('/me/player/seek', undefined, {
        params: { position_ms: Math.max(0, Math.round(positionMs)), device_id: deviceId || undefined },
    })
}

export async function setVolume(percent: number, deviceId?: string) {
    await spotify.put('/me/player/volume', undefined, {
        params: {
            volume_percent: Math.min(100, Math.max(0, Math.round(percent))),
            device_id: deviceId || undefined,
        },
    })
}

export async function setShuffle(state: boolean, deviceId?: string) {
    await spotify.put('/me/player/shuffle', undefined, {
        params: { state, device_id: deviceId || undefined },
    })
}

export async function setRepeat(state: RepeatState, deviceId?: string) {
    await spotify.put('/me/player/repeat', undefined, {
        params: { state, device_id: deviceId || undefined },
    })
}

export async function addToQueue(uri: string, deviceId?: string) {
    await spotify.post('/me/player/queue', undefined, {
        params: { uri, device_id: deviceId || undefined },
    })
}

export async function transferPlayback(deviceId: string, play = true) {
    await spotify.put('/me/player', { device_ids: [deviceId], play })
}

// Dipakai route lama /api/play: memutar konteks lalu menyalakan
// repeat dan shuffle, mengabaikan kegagalan keduanya.
export async function playContextWithDefaults(deviceId?: string, contextUri?: string) {
    await play({ deviceId, contextUri })

    await setRepeat('context', deviceId).catch(() => {})
    await setShuffle(true, deviceId).catch(() => {})
}
