import spotify from '@/lib/spotify'
import { SpotifyUser } from '../types/user'

// Memakai /me, bukan /users/{id}: aplikasi berjalan sebagai akun pemiliknya
// sendiri, dan endpoint profil publik dibalas 403 untuk aplikasi ini.
export async function currentUser(): Promise<SpotifyUser> {
    const res = await spotify.get<SpotifyUser>('/me')

    return res.data
}
