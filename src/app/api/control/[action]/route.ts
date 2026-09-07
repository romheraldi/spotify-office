import { fail, failFromSpotify, ok } from '@/lib/api-response'
import { requireControl } from '@/modules/auth/guard'
import * as control from '@/modules/player/data/control'
import { RepeatState } from '@/modules/player/data/control'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

interface ControlBody {
    deviceId?: string
    contextUri?: string
    uri?: string
    positionMs?: number
    percent?: number
    state?: boolean | RepeatState
    play?: boolean
}

const REPEAT_STATES: RepeatState[] = ['off', 'context', 'track']

async function run(action: string, body: ControlBody) {
    switch (action) {
        case 'play':
            if (body.contextUri || body.uri) {
                await control.play({ deviceId: body.deviceId, contextUri: body.contextUri, uri: body.uri })
                return null
            }

            await control.resume(body.deviceId)
            return null

        case 'pause':
            await control.pause(body.deviceId)
            return null

        case 'next':
            await control.next(body.deviceId)
            return null

        case 'previous':
            await control.previous(body.deviceId)
            return null

        case 'seek':
            if (typeof body.positionMs !== 'number' || !Number.isFinite(body.positionMs)) {
                return fail('INVALID_BODY', 'positionMs harus berupa angka', 400)
            }

            await control.seek(body.positionMs, body.deviceId)
            return null

        case 'volume':
            if (typeof body.percent !== 'number' || !Number.isFinite(body.percent)) {
                return fail('INVALID_BODY', 'percent harus berupa angka', 400)
            }

            await control.setVolume(body.percent, body.deviceId)
            return null

        case 'shuffle':
            if (typeof body.state !== 'boolean') {
                return fail('INVALID_BODY', 'state harus true atau false', 400)
            }

            await control.setShuffle(body.state, body.deviceId)
            return null

        case 'repeat':
            if (typeof body.state !== 'string' || !REPEAT_STATES.includes(body.state)) {
                return fail('INVALID_BODY', 'state harus off, context, atau track', 400)
            }

            await control.setRepeat(body.state, body.deviceId)
            return null

        case 'queue':
            if (!body.uri) {
                return fail('INVALID_BODY', 'uri wajib diisi', 400)
            }

            await control.addToQueue(body.uri, body.deviceId)
            return null

        case 'device':
            if (!body.deviceId) {
                return fail('INVALID_BODY', 'deviceId wajib diisi', 400)
            }

            await control.transferPlayback(body.deviceId, body.play ?? true)
            return null

        default:
            return fail('UNKNOWN_ACTION', `Aksi ${action} tidak dikenal`, 404)
    }
}

export async function POST(req: NextRequest, { params }: { params: { action: string } }) {
    const denied = requireControl()
    if (denied) return denied

    const body: ControlBody = await req.json().catch(() => ({}))

    try {
        return (await run(params.action, body)) || ok()
    } catch (error) {
        return failFromSpotify(error)
    }
}
