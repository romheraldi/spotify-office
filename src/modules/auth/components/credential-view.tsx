'use client'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface TokenPair {
    refreshToken: string
    token: string
}

function CopyField({ label, value }: { label: string; value: string }) {
    const [copied, setCopied] = useState(false)

    return (
        <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{label}</p>
            <button
                type="button"
                onClick={async () => {
                    await navigator.clipboard.writeText(value)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                }}
                className="mt-2 w-full break-all rounded-soft bg-white/70 px-4 py-3 text-left text-xs text-ink-muted transition-colors hover:bg-white"
            >
                {value}
            </button>
            <p className="mt-1.5 text-xs text-accent-deep">{copied ? 'Tersalin' : 'Klik untuk menyalin'}</p>
        </div>
    )
}

export default function CredentialView() {
    const query = useSearchParams()
    const code = query.get('code')
    const [data, setData] = useState<TokenPair>()
    const [error, setError] = useState('')

    const loadData = useCallback(async () => {
        try {
            const res = await fetch('/api/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ spotifyCode: code }),
            })
            const body = await res.json()

            if (!res.ok) throw new Error(body?.data?.error_description || 'Kode otorisasi tidak bisa ditukar')

            setData(body)
        } catch (loadError) {
            setError((loadError as Error).message)
        }
    }, [code])

    useEffect(() => {
        if (code) loadData()
    }, [code, loadData])

    return (
        <div className="glass w-full max-w-lg rounded-panel p-8 shadow-glass">
            <h1 className="text-2xl font-semibold">Token Spotify</h1>

            {!code && (
                <p className="mt-2 text-sm text-ink-muted">
                    Halaman ini hanya berisi hasil otorisasi. Mulai dari{' '}
                    <a href="/setup/authorize" className="underline underline-offset-4">
                        halaman otorisasi
                    </a>
                    .
                </p>
            )}

            {!!code && !data && !error && <p className="mt-2 text-sm text-ink-muted">Menukar kode otorisasi...</p>}

            {!!error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            {data && (
                <>
                    <p className="mt-2 text-sm text-ink-muted">
                        Salin refresh token ke environment server sebagai SPOTIFY_REFRESH_TOKEN, lalu jalankan ulang
                        aplikasi.
                    </p>
                    <CopyField label="Refresh token" value={data.refreshToken} />
                    <CopyField label="Access token" value={data.token} />
                </>
            )}
        </div>
    )
}
