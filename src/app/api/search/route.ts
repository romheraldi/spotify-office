import { failFromSpotify, ok } from '@/lib/api-response'
import { requireControl } from '@/modules/auth/guard'
import { searchTrack } from '@/modules/player/data/search'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    const denied = requireControl()
    if (denied) return denied

    const search = req.nextUrl.searchParams.get('q')?.trim()

    if (!search) {
        return ok([])
    }

    try {
        return ok(await searchTrack(search))
    } catch (error) {
        return failFromSpotify(error)
    }
}
