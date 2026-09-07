import { isUnlocked } from '@/modules/auth/guard'
import { redirect } from 'next/navigation'
import PinForm from '@/modules/auth/components/pin-form'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Buka kontrol pemutar',
}

export default function Login({ searchParams }: { searchParams: { next?: string } }) {
    const next = searchParams.next?.startsWith('/') ? searchParams.next : '/'

    if (isUnlocked()) {
        redirect(next)
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <PinForm next={next} />
        </main>
    )
}
