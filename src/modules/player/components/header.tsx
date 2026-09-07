/* eslint-disable @next/next/no-img-element */
'use client'
import IconButton from '@/components/ui/icon-button'
import { ChartIcon, LockIcon, NoteIcon, UnlockIcon } from '@/components/ui/icons'
import { usePlayer } from '../player-context'
import TrackSearch from './track-search'

interface HeaderProps {
    userName?: string
    userImage?: string
    onOpenStats: () => void
}

export default function Header({ userName, userImage, onOpenStats }: HeaderProps) {
    const { unlocked, requestUnlock, lock } = usePlayer()

    return (
        <header className="flex flex-wrap items-center gap-3 border-b border-white/60 px-4 py-4 md:flex-nowrap md:px-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                <NoteIcon className="h-5 w-5" />
            </span>

            <div className="order-3 w-full md:order-none md:flex-1">
                <TrackSearch />
            </div>

            <div className="ml-auto flex items-center gap-2 md:ml-0">
                <button
                    type="button"
                    onClick={onOpenStats}
                    className="flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-white/90"
                >
                    <ChartIcon className="h-4 w-4" />
                    Statistik
                </button>

                <button
                    type="button"
                    onClick={() => (unlocked ? lock() : requestUnlock())}
                    aria-label={unlocked ? 'Kunci kontrol' : 'Buka kontrol dengan PIN'}
                    className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                        unlocked
                            ? 'bg-accent/15 text-accent-deep hover:bg-accent/25'
                            : 'bg-ink text-white hover:bg-black'
                    }`}
                >
                    {unlocked ? <UnlockIcon className="h-4 w-4" /> : <LockIcon className="h-4 w-4" />}
                    <span className="hidden sm:inline">{unlocked ? 'Terbuka' : 'Terkunci'}</span>
                </button>

                {userImage ? (
                    <img
                        src={userImage}
                        alt={userName ? `Foto ${userName}` : 'Foto pemilik akun'}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-white/80"
                    />
                ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-sm font-semibold text-ink-muted">
                        {userName?.slice(0, 1).toUpperCase() || '?'}
                    </span>
                )}
            </div>
        </header>
    )
}
