export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
export const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN
export const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI
export const SPOTIFY_USER_ID = process.env.SPOTIFY_USER_ID
export const GOOGLE_TAG_ID = process.env.GOOGLE_TAG_ID
export const APP_URL = new URL(SPOTIFY_REDIRECT_URI || 'http://localhost:3000').origin
