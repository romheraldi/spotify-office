'use client'
import Slider from '@/components/ui/slider'
import { formatDuration } from '@/lib/format'
import useProgress from '../hooks/use-progress'
import { usePlayer } from '../player-context'
import DeviceMenu from './device-menu'
import VolumeControl from './volume-control'

export default function BottomBar() {
    const { snapshot, patch, control } = usePlayer()
    const state = snapshot.state
    const duration = state?.item?.duration_ms || 0

    const progress = useProgress({
        progressMs: patch.progressMs ?? state?.progress_ms ?? 0,
        durationMs: duration,
        isPlaying: patch.isPlaying ?? !!state?.is_playing,
        trackId: state?.item?.id,
    })

    return (
        <div className="flex flex-wrap items-center gap-4 border-t border-white/60 px-4 py-4 md:flex-nowrap md:px-6">
            <DeviceMenu />

            <div className="order-3 flex w-full flex-1 items-center gap-3 md:order-none md:w-auto">
                <span className="w-10 shrink-0 text-xs tabular-nums text-ink-muted">{formatDuration(progress)}</span>
                <Slider
                    label="Posisi lagu"
                    value={progress}
                    max={duration}
                    disabled={!state}
                    formatValue={value => formatDuration(value)}
                    onCommit={value =>
                        control(
                            'seek',
                            { positionMs: value, deviceId: state?.device?.id },
                            { patch: { progressMs: value } },
                        )
                    }
                />
                <span className="w-10 shrink-0 text-right text-xs tabular-nums text-ink-muted">
                    {formatDuration(duration)}
                </span>
            </div>

            <VolumeControl />
        </div>
    )
}
