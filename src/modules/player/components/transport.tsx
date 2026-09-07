'use client'
import IconButton from '@/components/ui/icon-button'
import { NextIcon, PauseIcon, PlayIcon, PreviousIcon, RepeatIcon, ShuffleIcon } from '@/components/ui/icons'
import { usePlayer } from '../player-context'

const REPEAT_LABEL: Record<string, string> = {
    off: 'Ulangi: mati',
    context: 'Ulangi: satu playlist',
    track: 'Ulangi: satu lagu',
}

export default function Transport() {
    const { snapshot, patch, control } = usePlayer()
    const state = snapshot.state

    const deviceId = state?.device?.id
    const isPlaying = patch.isPlaying ?? !!state?.is_playing
    const shuffle = patch.shuffle ?? !!state?.shuffle_state
    const repeat = patch.repeat ?? (state?.repeat_state as string) ?? 'off'

    const nextRepeat = repeat === 'off' ? 'context' : repeat === 'context' ? 'track' : 'off'

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-3">
            <IconButton
                label={shuffle ? 'Matikan acak' : 'Nyalakan acak'}
                active={shuffle}
                onClick={() => control('shuffle', { state: !shuffle, deviceId }, { patch: { shuffle: !shuffle } })}
            >
                <ShuffleIcon className="h-5 w-5" />
            </IconButton>

            <IconButton label="Lagu sebelumnya" onClick={() => control('previous', { deviceId })}>
                <PreviousIcon className="h-5 w-5" />
            </IconButton>

            <IconButton
                label={isPlaying ? 'Jeda' : 'Putar'}
                size="lg"
                tone="solid"
                onClick={() =>
                    control(isPlaying ? 'pause' : 'play', { deviceId }, { patch: { isPlaying: !isPlaying } })
                }
            >
                {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
            </IconButton>

            <IconButton label="Lagu berikutnya" onClick={() => control('next', { deviceId })}>
                <NextIcon className="h-5 w-5" />
            </IconButton>

            <IconButton
                label={REPEAT_LABEL[repeat] || 'Ulangi'}
                active={repeat !== 'off'}
                onClick={() => control('repeat', { state: nextRepeat, deviceId }, { patch: { repeat: nextRepeat } })}
                className="relative"
            >
                <RepeatIcon className="h-5 w-5" />
                {repeat === 'track' && (
                    <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-accent-deep" />
                )}
            </IconButton>
        </div>
    )
}
