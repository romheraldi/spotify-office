import { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Icon({ children, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            {children}
        </svg>
    )
}

export function PlayIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" stroke="none" />
        </Icon>
    )
}

export function PauseIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <rect x="7" y="5" width="3.4" height="14" rx="1.2" fill="currentColor" stroke="none" />
            <rect x="13.6" y="5" width="3.4" height="14" rx="1.2" fill="currentColor" stroke="none" />
        </Icon>
    )
}

export function NextIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M6 6.5v11l8-5.5-8-5.5z" fill="currentColor" stroke="none" />
            <rect x="16" y="6" width="2.4" height="12" rx="1.1" fill="currentColor" stroke="none" />
        </Icon>
    )
}

export function PreviousIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M18 6.5v11l-8-5.5 8-5.5z" fill="currentColor" stroke="none" />
            <rect x="5.6" y="6" width="2.4" height="12" rx="1.1" fill="currentColor" stroke="none" />
        </Icon>
    )
}

export function ShuffleIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M3 7h3.2c1.3 0 2.5.7 3.2 1.8l4.2 6.4c.7 1.1 1.9 1.8 3.2 1.8H21" />
            <path d="M3 17h3.2c1.3 0 2.5-.7 3.2-1.8l.9-1.4" />
            <path d="M13.6 9.2l.9-1.4c.7-1.1 1.9-1.8 3.2-1.8H21" />
            <path d="M18.5 3.5L21 6l-2.5 2.5M18.5 15.5L21 18l-2.5 2.5" />
        </Icon>
    )
}

export function RepeatIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M4 12V9.5A3.5 3.5 0 0 1 7.5 6H19" />
            <path d="M16.5 3.5L19 6l-2.5 2.5" />
            <path d="M20 12v2.5a3.5 3.5 0 0 1-3.5 3.5H5" />
            <path d="M7.5 20.5L5 18l2.5-2.5" />
        </Icon>
    )
}

export function SearchIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4 4" />
        </Icon>
    )
}

export function LockIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <rect x="5" y="10.5" width="14" height="9.5" rx="3" />
            <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
        </Icon>
    )
}

export function UnlockIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <rect x="5" y="10.5" width="14" height="9.5" rx="3" />
            <path d="M8.5 10.5V8a3.5 3.5 0 0 1 6.8-1.2" />
        </Icon>
    )
}

export function VolumeIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M5 9.5h3l4-3.2v11.4l-4-3.2H5z" fill="currentColor" stroke="none" />
            <path d="M16 9.2a4 4 0 0 1 0 5.6" />
            <path d="M18.6 6.6a7.5 7.5 0 0 1 0 10.8" />
        </Icon>
    )
}

export function MuteIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M5 9.5h3l4-3.2v11.4l-4-3.2H5z" fill="currentColor" stroke="none" />
            <path d="M16 9.5l5 5M21 9.5l-5 5" />
        </Icon>
    )
}

export function QueueIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M4 7h11M4 12h11M4 17h7" />
            <path d="M17.5 12.5v6.2" />
            <circle cx="16" cy="18.7" r="1.6" />
        </Icon>
    )
}

export function DeviceIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <rect x="7" y="3" width="10" height="18" rx="2.6" />
            <path d="M11 18h2" />
        </Icon>
    )
}

export function ChartIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M4 19.5h16" />
            <rect x="6" y="11" width="3" height="6" rx="1.2" />
            <rect x="11" y="7" width="3" height="10" rx="1.2" />
            <rect x="16" y="13" width="3" height="4" rx="1.2" />
        </Icon>
    )
}

export function CloseIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
        </Icon>
    )
}

export function PlusIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M12 5.5v13M5.5 12h13" />
        </Icon>
    )
}

export function NoteIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M9 18V6.5l9-1.8V16" fill="none" />
            <circle cx="7" cy="18" r="2.4" fill="currentColor" stroke="none" />
            <circle cx="16" cy="16" r="2.4" fill="currentColor" stroke="none" />
        </Icon>
    )
}

export function CheckIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
        </Icon>
    )
}
