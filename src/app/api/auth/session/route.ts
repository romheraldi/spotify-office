import { ok } from '@/lib/api-response'
import { currentSession } from '@/modules/auth/guard'

export const dynamic = 'force-dynamic'

export async function GET() {
    const session = currentSession()

    return ok({ unlocked: session.valid, expiresAt: session.expiresAt ?? null })
}
