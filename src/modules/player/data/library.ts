import { userPlaylists } from '@/modules/stats/data/playlists'
import { getDevices } from './player'

export async function getLibrary() {
    const [playlists, devices] = await Promise.all([userPlaylists(), getDevices()])

    return { playlists, devices }
}
