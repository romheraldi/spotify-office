/* eslint-disable @next/next/no-img-element */
'use client'
import { LockIcon } from '@/components/ui/icons'
import { usePlayer } from '../player-context'
import Transport from './transport'

export default function NowPlaying() {
    const { snapshot, unlocked, requestUnlock } = usePlayer()
    const track = snapshot.state?.item

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative w-full max-w-[280px]">
                <div className="rounded-card bg-white p-3 shadow-card">
                    {track ? (
                        <img
                            key={track.album.images[0]?.url}
                            src={track.album.images[0]?.url}
                            alt={`Sampul album ${track.album.name}`}
                            className="aspect-square w-full rounded-[14px] object-cover"
                        />
                    ) : (
                        <div className="flex aspect-square w-full items-center justify-center rounded-[14px] bg-surface text-sm text-ink-soft">
                            Tidak ada lagu
                        </div>
                    )}
                </div>

                {!unlocked && (
                    <button
                        type="button"
                        onClick={() => requestUnlock()}
                        aria-label="Kontrol terkunci, buka dengan PIN"
                        className="glass-strong absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full text-ink shadow-pill transition-transform hover:scale-105"
                    >
                        <LockIcon className="h-4 w-4" />
                    </button>
                )}
            </div>

            <Transport />
        </div>
    )
}
