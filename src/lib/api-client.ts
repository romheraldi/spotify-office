export class ApiError extends Error {
    code: string
    status: number

    constructor(code: string, message: string, status: number) {
        super(message)
        this.name = 'ApiError'
        this.code = code
        this.status = status
    }
}

interface Envelope<T> {
    ok: boolean
    data?: T
    error?: { code: string; message: string }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(path, { cache: 'no-store', ...init })
    const body = (await res.json().catch(() => null)) as Envelope<T> | null

    if (!res.ok || !body?.ok) {
        throw new ApiError(
            body?.error?.code || 'UNKNOWN',
            body?.error?.message || 'Permintaan gagal diproses',
            res.status,
        )
    }

    return body.data as T
}

export function apiGet<T>(path: string, init?: RequestInit) {
    return request<T>(path, init)
}

export function apiPost<T>(path: string, body?: unknown, init?: RequestInit) {
    return request<T>(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body ?? {}),
        ...init,
    })
}

export function apiDelete<T>(path: string) {
    return request<T>(path, { method: 'DELETE' })
}
