import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from '@/config'
import axiosDefault from 'axios'
import dayjs from 'dayjs'
import { SpotifyToken } from './spotify-token'

const axios = axiosDefault.create({
    baseURL: 'https://api.spotify.com/v1',
})

let tokenTTL: Date
let token = ''

axios.interceptors.request.use(async config => {
    if (tokenTTL > new Date() && token) {
        config.headers.Authorization = `Bearer ${token}`
        return config
    }

    const clientId = SPOTIFY_CLIENT_ID
    const clientSecret = SPOTIFY_CLIENT_SECRET
    const refreshToken = SPOTIFY_REFRESH_TOKEN
    const encodedToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const res = await axiosDefault.post<SpotifyToken>(
        'https://accounts.spotify.com/api/token',
        {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${encodedToken}`,
            },
        },
    )

    tokenTTL = dayjs()
        .add(res.data.expires_in - 60, 'second')
        .toDate()

    token = res.data.access_token
    config.headers.Authorization = `Bearer ${token}`

    return config
})

export default axios
