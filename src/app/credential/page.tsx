import { isUnlocked } from '@/modules/auth/guard'
import CredentialView from '@/modules/auth/components/credential-view'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Token Spotify',
}

export default function Credential() {
    if (!isUnlocked()) {
        redirect('/login?next=/credential')
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-10">
            <Suspense>
                <CredentialView />
            </Suspense>
        </main>
    )
}
