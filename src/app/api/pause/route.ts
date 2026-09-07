import { pause } from '@/modules/player/data/control'
import { responseJson } from '@/utils/response-json'
import { NextApiRequest } from 'next'

export const dynamic = 'force-dynamic'

// Route lama yang dipakai oleh shortcut harian. Bentuk permintaan dan
// responsnya sengaja dipertahankan apa adanya.
export async function GET(req: NextApiRequest) {
    try {
        const uri = new URL(req.url || 'http://localhost')
        const deviceId = uri.searchParams.get('device_id') || ''

        await pause(deviceId)

        return responseJson({ message: 'Success pause Track' })
    } catch (error: any) {
        console.error(error?.response || error)
        return responseJson({ message: 'Failed pause Track' }, 500)
    }
}
