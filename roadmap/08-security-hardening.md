# Step 8: Security Hardening — практичный план

> Реальное усилие: 3-4 часа · Не отдельный спринт — делаем параллельно
> Пересмотрено через призму нашей архитектуры (изолированные VPS, минимальный API)

## Контекст

Оригинальный анализ на базе VIBE_CODING_SECURITY.md дал 12 пробелов.
После сопоставления с нашей моделью (management API + SSH к изолированным VPS,
agent data живёт на client VPS) — 7 из 12 оказались нерелевантными или уже
реализованными.

## Что уже реализовано ✅
- OAuth scopes (read+send, no delete)
- Approval Queue (human-in-the-loop)
- SOUL.md security rules
- 2FA, JWT HMAC, OTP
- UFW, SSL, non-root user
- Qdrant localhost-only
- Command injection sanitization
- AllPay webhook HMAC + orderId dedup (idempotency)
- Self-Healing Agent (10 checks, auto-fix, Telegram alerts)
- Cloud-init hardened defaults
- Auto-updates, daily backups
- VPS isolation (каждый клиент — свой сервер)
- GDPR deletion (VPS удаляется при отмене, 7-day grace)
- Graceful degradation (Mem0 gracefulDegradation)

## Что НЕ релевантно ❌
- CSV/export sanitization — нет CSV export в системе
- Data retention policy для agent data — живёт на client VPS, не наше
- Global kill switch — overkill при < 50 клиентах, SSH stop per VPS достаточно
- Full audit logging — console.log + journalctl достаточно на текущем этапе
- Row-level security — нет multi-tenant DB для agent data

## Реальный TODO (3-4 часа)

### 1. Документация secrets rotation (30 мин)

Создать файл `docs/secrets-rotation.md`:
```
## SSH Master Key
- Где: /root/.ssh/openclaw_master на management VPS
- Ротация: при подозрении на компрометацию
- Процедура: генерировать новый → deploy на все client VPS → удалить старый

## JWT Secret
- Где: .env на management VPS (JWT_SECRET)
- Ротация: при подозрении на компрометацию
- Процедура: обновить .env → restart API → все сессии invalidated

## DB Password
- Где: docker-compose.yml + .env на management VPS
- Риск: низкий (PostgreSQL не exposed, localhost only)
- Ротация: при перестройке management VPS

## AllPay Webhook Secret
- Где: .env (ALLPAY_WEBHOOK_SECRET)
- Ротация: при обновлении AllPay integration
```

### 2. Rate limiter middleware (1 час)

```typescript
// apps/api/src/middleware/rateLimiter.ts
const rateLimits = new Map<string, { count: number; resetAt: number }>()

export function rateLimiter(max = 100, windowMs = 60000) {
  return async (c, next) => {
    const key = c.req.header('Authorization')?.slice(0, 20) || c.req.header('x-real-ip') || 'anon'
    const now = Date.now()
    const entry = rateLimits.get(key)

    if (entry && entry.resetAt > now) {
      if (entry.count >= max) {
        return c.json({ success: false, message: 'Too many requests' }, 429)
      }
      entry.count++
    } else {
      rateLimits.set(key, { count: 1, resetAt: now + windowMs })
    }

    await next()
  }
}
```

Применить:
- Global: 100 req/min
- `/hosting/checkout`: 5 req/min
- `/hosting/auth/*`: 10 req/min

### 3. Error response audit (30 мин)

Проверить все `catch` блоки в controllers:
- `console.error` для внутреннего лога ✅ (уже делаем)
- `fail(c, 'generic message', 500)` для клиента ✅ (уже делаем)
- Убедиться что нигде нет `fail(c, err.message, 500)` — err.message может содержать paths

### 4. Failed login alerting (1 час)

В `apps/api/src/controllers/hosting/auth.ts`:
```typescript
const failedLogins = new Map<string, number>()

// При failed OTP verify:
const email = body.email
failedLogins.set(email, (failedLogins.get(email) || 0) + 1)

if (failedLogins.get(email) >= 5) {
  await telegram.alertAdmin(`⚠️ 5+ failed login attempts: ${email}`)
  failedLogins.delete(email)
}
```

### 5. Privacy Policy update (30 мин)

Добавить в `apps/web/public/privacy.html`:
- "При ביטול מנוי — השרת נמחק תוך 7 ימים. כל הנתונים נמחקים לצמיתות."
- "ניתן לבקש מחיקת כל המידע: support@flowmatic.co.il"

## Файлы для создания/изменения

| Файл | Усилие |
|------|--------|
| `docs/secrets-rotation.md` | 30 мин — создать |
| `apps/api/src/middleware/rateLimiter.ts` | 30 мин — создать |
| `apps/api/src/app.ts` | 10 мин — подключить middleware |
| `apps/api/src/controllers/hosting/auth.ts` | 30 мин — failed login alert |
| Controllers audit (grep for err.message) | 30 мин — проверить |
| `apps/web/public/privacy.html` | 10 мин — обновить |

## При масштабировании (10+ клиентов)

- Audit log table + middleware
- Structured JSON logging
- Global kill switch endpoint
- Secrets rotation automation
