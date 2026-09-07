/** @type {Record<string,string>} */
const env = {}

if (process.env.HOTJAR_SITE_ID) {
    env.HOTJAR_SITE_ID = process.env.HOTJAR_SITE_ID
}

if (process.env.GOOGLE_TAG_ID) {
    env.GOOGLE_TAG_ID = process.env.GOOGLE_TAG_ID
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Memungkinkan build produksi dijalankan tanpa merusak folder kerja
    // server pengembangan yang sedang menyala.
    distDir: process.env.NEXT_BUILD_DIR || '.next',
    // Kredensial Spotify sengaja tidak diteruskan ke blok env agar tidak
    // ikut ter-inline ke bundle sisi klien.
    env,
    reactStrictMode: true,
    images: {
        remotePatterns: [{ hostname: '*.scdn.co' }, { hostname: '*.spotifycdn.com' }],
    },
}

export default nextConfig
