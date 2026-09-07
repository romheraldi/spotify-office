import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import { GOOGLE_TAG_ID } from '@/config'
import './globals.css'

const poppins = Poppins({ weight: ['400', '500', '600'], subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
    title: 'Pemutar Spotify Kantor',
    description: 'Pemutar bersama: lihat lagu yang sedang diputar, antrian, dan statistik Spotify kantor.',
}

export const viewport: Viewport = {
    themeColor: '#EFF1F5',
}

export const revalidate = 0

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="id">
            <body className={`${poppins.className} min-h-screen text-ink`}>
                {children}

                {!!GOOGLE_TAG_ID && (
                    <>
                        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`} />
                        <Script id="google-analytics">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${GOOGLE_TAG_ID}');
                            `}
                        </Script>
                    </>
                )}
            </body>
        </html>
    )
}
