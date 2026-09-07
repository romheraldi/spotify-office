/* eslint-disable @next/next/no-img-element */
'use client'

// Sampul album yang sedang diputar dipakai ulang sebagai gumpalan warna
// latar, sehingga suasana ruangan ikut berganti tiap lagu.
export default function Backdrop({ imageUrl }: { imageUrl?: string }) {
    return (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-surface">
            {imageUrl && (
                <img
                    key={imageUrl}
                    alt=""
                    aria-hidden="true"
                    src={imageUrl}
                    className="absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 scale-125 object-cover opacity-80 saturate-150 blur-[110px] transition-opacity duration-700"
                />
            )}
            <div className="absolute inset-0 bg-white/25" />
        </div>
    )
}
