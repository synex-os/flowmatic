# Step 8: Security Hardening — от 6/10 до 9/10

> Приоритет: Параллельно с основной разработкой · Влияние: Trust + Compliance

## Текущий уровень: 6/10

### Что уже реализовано ✅
- OAuth scopes (read+send, no delete)
- Approval Queue (human-in-the-loop)
- SOUL.md security rules
- 2FA в Dashboard (TOTP)
- JWT auth (HMAC-SHA256)
- CORS middleware
- AllPay webhook HMAC verification
- UFW firewall + SSL + non-root user
- Qdrant localhost-only
- Command injection sanitization (memoryId)
- Cloud-init hardened defaults
- Auto-updates at 4am
- Daily backups (7-day retention)
- Graceful degradation (Mem0 gracefulDegradation: true)
- Self-Healing Ops Agent (auto-fix + alerts)

### Критичные пробелы — HIGH PRIORITY

#### 1. Secrets Rotation
**Проблема:** SSH keys, JWT secret, DB password — никогда не ротируются.
**Решение:**
- Документировать процедуру ротации для каждого секрета
- JWT secret: ротация каждые 90 дней, поддержка двух ключей одновременно (old + new)
- SSH master key: ротация каждые 6 месяцев, deploy новый на все VPS
- DB password: ротация при подозрении на компрометацию
- Cron job reminder в Telegram каждые 90 дней

#### 2. API Rate Limiting
**Проблема:** Нет лимитов на API вызовы. DDoS или abuse = down.
**Решение:**
```typescript
// Hono middleware
app.use('*', rateLimiter({
  windowMs: 60000,      // 1 минута
  max: 100,             // 100 запросов
  keyGenerator: (c) => c.req.header('Authorization') || c.req.header('x-real-ip'),
  message: { error: 'Too many requests' }
}))

// Отдельные лимиты для тяжёлых endpoints
app.use('/hosting/instances/*/setup/*', rateLimiter({ max: 10, windowMs: 60000 }))
app.use('/hosting/checkout', rateLimiter({ max: 5, windowMs: 60000 }))
```

#### 3. Audit Logging
**Проблема:** Нет записи кто что делал. При инциденте — слепые.
**Решение:**
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id TEXT,
  user_id UUID,
  action VARCHAR(100),    -- login|checkout|deploy|restart|delete|oauth_connect|memory_clear
  resource VARCHAR(100),  -- instance|output|integration|memory
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_audit_instance ON audit_log(instance_id, created_at DESC);
```
Middleware логирует: auth, billing, provisioning, integration changes, agent restarts.

#### 4. Security Monitoring & Alerting
**Проблема:** Не знаем о подозрительной активности.
**Решение:**
- Telegram алерт на: 5+ failed auth за 5 мин, unusual API pattern, SSH brute force
- Интеграция с Self-Healing Agent: добавить security checks
- Daily security digest: failed logins, new integrations, memory access patterns

#### 5. Kill Switch
**Проблема:** Нет способа экстренно остановить все агенты.
**Решение:**
```typescript
// POST /admin/kill-switch
// Останавливает ВСЕ OpenClaw gateway на всех client VPS
async function killSwitch() {
  const allInstances = await db.select().from(instances).where(eq(instances.status, 'running'))
  for (const inst of allInstances) {
    await sshExec(inst.ip, 'systemctl stop openclaw-gateway', inst.rootPassword)
    await db.update(instances).set({ status: 'emergency_stop' }).where(eq(instances.id, inst.id))
  }
  await telegram.alertAdmin('🚨 KILL SWITCH ACTIVATED — all agents stopped')
}
```
Кнопка в Admin panel + Telegram command.

#### 6. Error Information Leakage
**Проблема:** Error responses могут содержать file paths, stack traces.
**Решение:**
```typescript
// Global error handler
app.onError((err, c) => {
  console.error('API Error:', err)  // log full error internally
  // Return generic error to client
  return c.json({
    success: false,
    message: 'An error occurred',
    code: err.status || 500
  }, err.status || 500)
})
```
Никогда не возвращать `err.message` или `err.stack` клиенту.

### Средние пробелы — MEDIUM PRIORITY

#### 7. Data Retention Policy
- Agent outputs: 90 дней, потом архив
- Activity logs: 1 год
- Backups: 7 дней (уже реализовано)
- Audit log: 2 года
- Mem0 memories: 365 дней TTL (уже реализовано)
- Документировать в Privacy Policy

#### 8. GDPR Right to Erasure
- Endpoint: `DELETE /hosting/instances/:id/gdpr-delete`
- Удаляет: instance data, outputs, memories, activity logs, audit logs, backups
- Уведомляет клиента по email
- Логирует в audit (без PII)

#### 9. Webhook Replay Prevention
- AllPay webhook: добавить timestamp check (±5 мин)
- Idempotency: проверять `orderId` на дубликат (уже есть частично)

#### 10. Database Row-Level Security
- Verify: каждый query фильтрует по `userId` или `instanceId`
- Добавить PostgreSQL RLS policies как дополнительный слой

## Файлы для создания/изменения

| Файл | Действие |
|------|----------|
| `apps/api/src/middleware/rateLimiter.ts` | Создать |
| `apps/api/src/middleware/auditLog.ts` | Создать |
| `apps/api/src/middleware/errorHandler.ts` | Создать |
| `apps/api/src/controllers/hosting/admin.ts` | Добавить kill switch |
| `apps/api/src/db/schema.ts` | audit_log table |
| `apps/api/src/app.ts` | Подключить middleware |
| `docs/security-rotation.md` | Создать — процедура ротации |
| DB migration | CREATE TABLE audit_log |

## Порядок реализации

1. Error handler (быстро, критично)
2. Rate limiting middleware
3. Audit log table + middleware
4. Kill switch endpoint
5. Security monitoring alerts (в Self-Healing)
6. Secrets rotation documentation
7. GDPR delete endpoint
8. Data retention policy документ
