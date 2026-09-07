'use client'
import { PieChart, pieChartDefaultProps } from 'react-minimal-pie-chart'
import { SpotifyGenre } from '../types/genre'

const COLORS = ['#17171C', '#0FB39E', '#73ECDD', '#B9BCC7', '#E4E6EC']

export default function GenreChart({ genres }: { genres: SpotifyGenre[] }) {
    const datasource = genres.map((genre, index) => ({
        title: genre.name,
        value: genre.percentage,
        color: COLORS[index % COLORS.length],
    }))

    if (datasource.length === 0) return null

    return (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="w-40 shrink-0">
                <PieChart
                    data={datasource}
                    radius={pieChartDefaultProps.radius - 4}
                    lineWidth={42}
                    rounded
                    animate
                    startAngle={-90}
                    segmentsStyle={{ transition: 'stroke .3s' }}
                />
            </div>

            <ul className="flex-1 space-y-2">
                {datasource.map(genre => (
                    <li key={genre.title} className="flex items-center gap-2.5 text-sm">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: genre.color }} />
                        <span className="flex-1 truncate capitalize">{genre.title}</span>
                        <span className="tabular-nums text-ink-muted">{Math.round(genre.value)}%</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
