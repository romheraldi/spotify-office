import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } from '@/config'
import { SpotifyToken } from '@/lib/spotify-token'
import { responseJson } from '@/utils/response-json'
import axios, { AxiosError } from 'axios'

export const revalidate = 0

export async function POST(req: Request) {
    try {
        const clientId = SPOTIFY_CLIENT_ID
        const clientSecret = SPOTIFY_CLIENT_SECRET
        const encodedToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

        const body = await req.json()
        const code = body.spotifyCode

        if (!code) {
            return responseJson({ message: 'code not defined' }, 400)
        }

        axios.interceptors.request.clear()
        const resToken = await axios.post<SpotifyToken>(
            'https://accounts.spotify.com/api/token',
            {
                grant_type: 'authorization_code',
                code,
                redirect_uri: SPOTIFY_REDIRECT_URI,
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${encodedToken}`,
                },
            },
        )

        return responseJson({ refreshToken: resToken.data.refresh_token, token: resToken.data.access_token })
    } catch (error) {
        const data = error instanceof AxiosError ? error.response?.data : undefined
        const message = error instanceof AxiosError ? error.message : error
        const statusCode = error instanceof AxiosError ? error.response?.status || 500 : 500

        return responseJson({ message, statusCode, data }, statusCode)
    }
}
