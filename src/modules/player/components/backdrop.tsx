/* eslint-disable @next/next/no-img-element */
'use client'
import { useEffect, useState } from 'react'

// Sampul album yang sedang diputar dipakai sebagai latar: cukup buram agar
// teks tetap nyaman dibaca, tetapi bentuk dan warnanya masih terlihat.
// Sampul lama dipertahankan di bawah sampai sampul baru selesai memudar
// masuk, sehingga pergantian lagu tidak berkedip.
export default function Backdrop({ imageUrl }: { imageUrl?: string }) {
    const [layers, setLayers] = useState<string[]>(imageUrl ? [imageUrl] : [])

    useEffect(() => {
        if (!imageUrl) return

        setLayers(current => (current[current.length - 1] === imageUrl ? current : [...current.slice(-1), imageUrl]))
    }, [imageUrl])

    return (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-surface">
            <div className="absolute inset-0 opacity-[0.62]">
                {layers.map((url, index) => (
                    <img
                        key={url}
                        alt=""
                        aria-hidden="true"
                        src={url}
                        className={`absolute inset-0 h-full w-full scale-110 object-cover blur-[40px] saturate-[1.7] contrast-105 ${
                            index === layers.length - 1 ? 'animate-backdrop-in' : ''
                        }`}
                    />
                ))}
            </div>

            {/* Menenangkan bagian tengah tempat panel berdiri, sekaligus
                menjaga warna tetap hidup di tepi layar. */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.22)_45%,rgba(255,255,255,0.04)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/25 to-transparent" />
        </div>
    )
}
