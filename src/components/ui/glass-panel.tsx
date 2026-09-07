import { HTMLAttributes } from 'react'

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
    strong?: boolean
}

export default function GlassPanel({ strong, className = '', children, ...props }: GlassPanelProps) {
    return (
        <div
            className={`${strong ? 'glass-strong' : 'glass'} rounded-panel shadow-glass ${className}`.trim()}
            {...props}
        >
            {children}
        </div>
    )
}
