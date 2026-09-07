'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

interface SliderProps {
    value: number
    max: number
    label: string
    disabled?: boolean
    className?: string
    formatValue?: (value: number) => string
    onCommit: (value: number) => void
    onPreview?: (value: number) => void
}

// Slider yang bisa digeser dengan tetikus, sentuhan, maupun papan ketik.
// Selama digeser, nilai tampilan diambil dari keadaan lokal supaya tidak
// tersentak oleh pembaruan dari server.
export default function Slider({
    value,
    max,
    label,
    disabled,
    className = '',
    formatValue,
    onCommit,
    onPreview,
}: SliderProps) {
    const trackRef = useRef<HTMLDivElement>(null)
    const [dragging, setDragging] = useState(false)
    const [draft, setDraft] = useState(value)

    const shown = dragging ? draft : value
    const percent = max > 0 ? Math.min(100, Math.max(0, (shown / max) * 100)) : 0

    const valueFromClientX = useCallback(
        (clientX: number) => {
            const rect = trackRef.current?.getBoundingClientRect()
            if (!rect || rect.width === 0) return 0

            const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
            return Math.round(ratio * max)
        },
        [max],
    )

    useEffect(() => {
        if (!dragging) return

        const move = (event: PointerEvent) => {
            const next = valueFromClientX(event.clientX)
            setDraft(next)
            onPreview?.(next)
        }

        const up = (event: PointerEvent) => {
            const next = valueFromClientX(event.clientX)
            setDragging(false)
            onCommit(next)
        }

        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)

        return () => {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
        }
    }, [dragging, onCommit, onPreview, valueFromClientX])

    const step = Math.max(1, Math.round(max / 20))

    return (
        <div
            ref={trackRef}
            role="slider"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={Math.round(shown)}
            aria-valuetext={formatValue?.(shown)}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onPointerDown={event => {
                if (disabled) return
                const next = valueFromClientX(event.clientX)
                setDraft(next)
                setDragging(true)
                onPreview?.(next)
            }}
            onKeyDown={event => {
                if (disabled) return

                if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                    event.preventDefault()
                    onCommit(Math.min(max, value + step))
                }

                if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                    event.preventDefault()
                    onCommit(Math.max(0, value - step))
                }

                if (event.key === 'Home') onCommit(0)
                if (event.key === 'End') onCommit(max)
            }}
            className={`group relative flex h-6 w-full touch-none items-center ${disabled ? 'cursor-default opacity-60' : 'cursor-pointer'} ${className}`.trim()}
        >
            <div className="h-1.5 w-full rounded-full bg-ink/10">
                <div
                    className="h-full rounded-full bg-ink transition-[width] duration-150"
                    style={{ width: `${percent}%` }}
                />
            </div>
            <div
                className={`pointer-events-none absolute -ml-1.5 h-3.5 w-3.5 rounded-full bg-ink shadow-pill transition-transform ${dragging ? 'scale-125' : 'scale-0 group-hover:scale-100 group-focus-visible:scale-100'}`}
                style={{ left: `${percent}%` }}
            />
        </div>
    )
}
