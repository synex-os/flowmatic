// Cloudflare Pages Functions middleware — HTTP Basic Auth for the whole site.
// Runs before every request to flowmatic.co.il.
//
// Credentials:
//   Any username accepted · Password from env SITE_PASSWORD or fallback below.
// Override in Cloudflare dashboard → Pages → Settings → Environment variables
// (set SITE_PASSWORD; rotate there without a code change).
//
// To remove protection later: delete this file + push.

interface Env {
    SITE_PASSWORD?: string
}

const FALLBACK_PASSWORD = '12@0312@'
const REALM = 'Flowmatic'

export const onRequest: PagesFunction<Env> = async (context) => {
    const password = context.env.SITE_PASSWORD || FALLBACK_PASSWORD

    const auth = context.request.headers.get('Authorization') || ''
    if (!auth.startsWith('Basic ')) {
        return unauthorized()
    }
    const encoded = auth.slice('Basic '.length).trim()
    let decoded = ''
    try {
        decoded = atob(encoded)
    } catch {
        return unauthorized()
    }
    const sep = decoded.indexOf(':')
    if (sep < 0) return unauthorized()
    const pass = decoded.slice(sep + 1)

    if (!constantTimeEqual(pass, password)) {
        return unauthorized()
    }

    // Auth ok — continue to the static asset.
    return context.next()
}

function unauthorized(): Response {
    return new Response('גישה מוגבלת — הזינו את הסיסמה להמשך', {
        status: 401,
        headers: {
            'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
            'Content-Type': 'text/plain; charset=utf-8',
        },
    })
}

// Timing-safe-ish string compare. Not cryptographically perfect but good
// enough to defeat simple timing probes against a short secret.
function constantTimeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false
    let diff = 0
    for (let i = 0; i < a.length; i++) {
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    return diff === 0
}
