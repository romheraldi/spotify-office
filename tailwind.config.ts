import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                ink: {
                    DEFAULT: '#17171C',
                    muted: '#6B6C76',
                    soft: '#9A9BA6',
                },
                accent: {
                    DEFAULT: '#0FB39E',
                    soft: '#73ECDD',
                    deep: '#0A8C7C',
                },
                surface: '#EFF1F5',
            },
            borderRadius: {
                panel: '28px',
                card: '20px',
                soft: '14px',
            },
            boxShadow: {
                glass: '0 24px 60px -20px rgba(20, 20, 40, 0.18)',
                card: '0 18px 40px -18px rgba(20, 20, 40, 0.28)',
                pill: '0 10px 24px -12px rgba(20, 20, 40, 0.35)',
            },
            keyframes: {
                'fade-up': {
                    from: { opacity: '0', transform: 'translateY(12px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'backdrop-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
            },
            animation: {
                'fade-up': 'fade-up .35s ease-out both',
                'backdrop-in': 'backdrop-in 1.2s ease-out both',
            },
        },
    },
    plugins: [],
}
export default config
