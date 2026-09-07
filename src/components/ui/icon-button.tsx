'use client'
import { ButtonHTMLAttributes, forwardRef } from 'react'

type Size = 'sm' | 'md' | 'lg'
type Tone = 'ghost' | 'solid' | 'accent'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string
    size?: Size
    tone?: Tone
    active?: boolean
}

const sizes: Record<Size, string> = {
    sm: 'h-9 w-9',
    md: 'h-11 w-11',
    lg: 'h-14 w-14',
}

const tones: Record<Tone, string> = {
    ghost: 'text-ink-muted hover:text-ink hover:bg-white/70',
    solid: 'bg-ink text-white shadow-pill hover:bg-black',
    accent: 'bg-accent text-white shadow-pill hover:bg-accent-deep',
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
    { label, size = 'md', tone = 'ghost', active, className = '', children, ...props },
    ref,
) {
    return (
        <button
            ref={ref}
            type="button"
            aria-label={label}
            title={label}
            aria-pressed={active}
            className={`inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${sizes[size]} ${tones[tone]} ${active && tone === 'ghost' ? 'text-accent-deep bg-accent/10' : ''} ${className}`.trim()}
            {...props}
        >
            {children}
        </button>
    )
})

export default IconButton
