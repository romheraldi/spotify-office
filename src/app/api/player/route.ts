import { failFromSpotify, ok } from '@/lib/api-response'
import { getPlayerSnapshot } from '@/modules/player/data/player'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        return ok(await getPlayerSnapshot())
    } catch (error) {
        return failFromSpotify(error)
    }
}
