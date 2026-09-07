import { failFromSpotify, ok } from '@/lib/api-response'
import { requireControl } from '@/modules/auth/guard'
import { getLibrary } from '@/modules/player/data/library'

export const dynamic = 'force-dynamic'

export async function GET() {
    const denied = requireControl()
    if (denied) return denied

    try {
        return ok(await getLibrary())
    } catch (error) {
        return failFromSpotify(error)
    }
}
