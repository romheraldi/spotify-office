import { playContextWithDefaults } from '@/modules/player/data/control'
import { userPlaylists } from '@/modules/stats/data/playlists'
import { responseJson } from '@/utils/response-json'
import { NextApiRequest } from 'next'

export const dynamic = 'force-dynamic'

// Route lama yang dipakai oleh shortcut harian. Bentuk permintaan dan
// responsnya sengaja dipertahankan apa adanya.
export async function GET(req: NextApiRequest) {
    try {
        const uri = new URL(req.url || 'http://localhost')
        const deviceId = uri.searchParams.get('device_id') || ''
        let contextUri = uri.searchParams.get('context_uri') || ''

        if (!contextUri) {
            const playlists = await userPlaylists()
            // randomize the playlist
            const randomIndex = Math.floor(Math.random() * playlists.length)
            contextUri = playlists[randomIndex].uri
        }

        await playContextWithDefaults(deviceId, contextUri)

        return responseJson({ message: 'Success Play Track' })
    } catch (error: any) {
        console.error(error?.response || error)
        return responseJson({ message: 'Failed Play Track' }, 500)
    }
}
