// Cloudflare Pages Worker — HTTP Basic Auth gate on flowmatic.co.il.
// Lives in public/_worker.js so Next.js static export copies it to out/.
// When out/_worker.js exists, Cloudflare Pages runs it as the entry point
// for every request (static assets flow through env.ASSETS.fetch).
//
// Any username accepted · password from env SITE_PASSWORD (Pages → Settings
// → Environment variables). Falls back to the literal below so it works
// out of the box.
//
// Remove protection: delete this file + redeploy.

const FALLBACK_PASSWORD = '12@0312@'
const REALM = 'Flowmatic'

export default {
    async fetch(request, env) {
        const password = (env && env.SITE_PASSWORD) || FALLBACK_PASSWORD
        const auth = request.headers.get('Authorization') || ''

        if (auth.startsWith('Basic ')) {
            try {
                const decoded = atob(auth.slice(6).trim())
                const sep = decoded.indexOf(':')
                if (sep >= 0) {
                    const pass = decoded.slice(sep + 1)
                    if (constantTimeEqual(pass, password)) {
                        return env.ASSETS.fetch(request)
                    }
                }
            } catch {
                // fallthrough to 401
            }
        }

        return new Response('גישה מוגבלת — הזינו את הסיסמה להמשך', {
            status: 401,
            headers: {
                'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
                'Content-Type': 'text/plain; charset=utf-8',
            },
        })
    },
}

function constantTimeEqual(a, b) {
    if (a.length !== b.length) return false
    let diff = 0
    for (let i = 0; i < a.length; i++) {
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    return diff === 0
}
