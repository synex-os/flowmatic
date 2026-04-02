# Step 1: Self-Healing Ops Agent

> Приоритет: СЕЙЧАС · Усилие: 3 дня · Влияние: Survival
> Строить ДО 10-го клиента — после будет поздно

## Цель

Автономный мониторинг всех client VPS каждые 5 минут.
Автоисправление типичных проблем. Уведомление в Telegram.
Клиент может отключить авто-действия и получать только уведомления.

## Архитектура

**Daemon на каждом client VPS** (не SSH с management).

Причина: SSH polling к N серверам каждые 5 мин = O(N) нагрузка на management.
Daemon на каждом VPS = O(1) per server, reports to API.

```
[Client VPS]                    [Management API]
clawflow-health.service  ──→  POST /hosting/instances/:id/health-report
  runs every 5 min               stores in DB, evaluates, alerts
  checks local services
  auto-fixes if allowed
```

## Что мониторить

| Check | Threshold | Auto-Action | Escalation |
|-------|-----------|-------------|------------|
| SSL expiry | < 7 дней | `certbot renew` | Telegram если renew failed |
| Disk usage | > 85% | `docker system prune`, clean logs | Telegram если > 95% |
| RAM usage | > 90% | Restart OpenClaw gateway | Telegram если не помогло |
| CPU stuck | > 90% > 10 мин | Restart OpenClaw gateway | Telegram |
| OpenClaw gateway down | process not running | `systemctl restart openclaw-gateway` | Telegram если 3 restart failed |
| Qdrant down | port 6333 not responding | `docker compose restart qdrant` | Telegram |
| Automation tool down | port 5678/8080 not responding | `docker compose restart` | Telegram |
| Cron job failure | 3+ consecutive | Notify only | Telegram |
| OpenClaw update available | version mismatch | Notify only (auto-update at 4am) | — |
| API rate limit | 429 from Anthropic | Notify клиента: "add credits" | Telegram |

## Реализация

### 1. Health daemon script (на каждом client VPS)

Файл: `scripts/clawflow-health-daemon.sh`

Устанавливается через cloud-init. Systemd timer каждые 5 минут.

```bash
#!/bin/bash
# ClawFlow Health Daemon — runs on each client VPS
INSTANCE_ID="{{INSTANCE_ID}}"
API_URL="https://api.clawflow.flowmatic.co.il"
AUTO_HEAL="{{AUTO_HEAL}}"  # true | false (user preference)

# Collect metrics
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d. -f1)
RAM=$(free | awk '/Mem:/{printf "%.0f", $3/$2*100}')
DISK=$(df / | awk 'NR==2{print $5}' | tr -d '%')

# Check services
OC_STATUS=$(systemctl is-active openclaw-gateway 2>/dev/null || echo "dead")
QDRANT_STATUS=$(curl -sf http://127.0.0.1:6333/healthz 2>/dev/null && echo "ok" || echo "dead")
AUTO_STATUS=$(curl -sf http://127.0.0.1:8080/api/v1/flags 2>/dev/null && echo "ok" || \
              curl -sf http://127.0.0.1:5678/healthz 2>/dev/null && echo "ok" || echo "dead")

# SSL check
SSL_DAYS=$(echo | openssl s_client -servername $(hostname -f) -connect localhost:443 2>/dev/null | \
           openssl x509 -noout -enddate 2>/dev/null | \
           awk -F= '{print $2}' | xargs -I{} bash -c 'echo $(( ($(date -d "{}" +%s) - $(date +%s)) / 86400 ))') 2>/dev/null || SSL_DAYS=999

# Build actions array
ACTIONS=""

# Auto-heal if enabled
if [ "$AUTO_HEAL" = "true" ]; then
  if [ "$OC_STATUS" = "dead" ]; then
    systemctl restart openclaw-gateway
    ACTIONS="${ACTIONS},gateway_restarted"
  fi
  if [ "$QDRANT_STATUS" = "dead" ]; then
    cd /opt/openclaw && docker compose -f docker-compose.yml -f docker-compose.qdrant.yml restart qdrant 2>/dev/null
    ACTIONS="${ACTIONS},qdrant_restarted"
  fi
  if [ "$DISK" -gt 85 ]; then
    docker system prune -af --volumes 2>/dev/null
    journalctl --vacuum-size=50M 2>/dev/null
    find /var/log -name "*.gz" -delete 2>/dev/null
    ACTIONS="${ACTIONS},disk_cleaned"
  fi
  if [ "$RAM" -gt 90 ] && [ "$OC_STATUS" = "active" ]; then
    systemctl restart openclaw-gateway
    ACTIONS="${ACTIONS},ram_gateway_restarted"
  fi
  if [ "$SSL_DAYS" -lt 7 ] && [ "$SSL_DAYS" -ne 999 ]; then
    certbot renew --quiet 2>/dev/null
    ACTIONS="${ACTIONS},ssl_renewed"
  fi
fi

# Report to API
curl -sf -X POST "$API_URL/hosting/instances/$INSTANCE_ID/health-report" \
  -H "Content-Type: application/json" \
  -d "{
    \"cpu\": $CPU, \"ram\": $RAM, \"disk\": $DISK,
    \"gateway\": \"$OC_STATUS\", \"qdrant\": \"$QDRANT_STATUS\",
    \"automation\": \"$AUTO_STATUS\", \"ssl_days\": $SSL_DAYS,
    \"actions\": \"${ACTIONS#,}\"
  }" > /dev/null 2>&1
```

### 2. API endpoint

Файл: `apps/api/src/controllers/hosting/healthReport.ts`

```typescript
export const healthReport = async (c: Context) => {
    const instanceId = c.req.param('id')
    const body = await c.req.json()

    // Save to DB
    await db.update(instances).set({
        lastHealthReport: body,
        lastHealthAt: new Date(),
    }).where(eq(instances.id, instanceId))

    // Evaluate alerts
    const alerts = []
    if (body.gateway === 'dead') alerts.push('🔴 OpenClaw Gateway down')
    if (body.qdrant === 'dead') alerts.push('🟡 Qdrant (memory) down')
    if (body.automation === 'dead') alerts.push('🟡 Automation tool down')
    if (body.disk > 95) alerts.push('🔴 Disk usage: ' + body.disk + '%')
    if (body.ram > 95) alerts.push('🟡 RAM usage: ' + body.ram + '%')
    if (body.ssl_days < 3) alerts.push('🔴 SSL expires in ' + body.ssl_days + ' days')

    // Auto-actions taken
    if (body.actions) {
        alerts.push('🔧 Auto-actions: ' + body.actions)
    }

    // Send Telegram alert to instance owner
    if (alerts.length > 0) {
        const [instance] = await db.select().from(instances).where(eq(instances.id, instanceId))
        if (instance?.telegramChatId) {
            const msg = `⚠️ *ClawFlow Alert*\n\n${alerts.join('\n')}\n\nInstance: ${instanceId}`
            await telegram.sendMessage(instance.telegramChatId, msg, { parse_mode: 'Markdown' })
        }
        // Also alert admin (Sergei)
        await telegram.alertAdmin(`Instance ${instanceId}:\n${alerts.join('\n')}`)
    }

    return ok(c, null, 'Health report received')
}
```

### 3. Cloud-init addition

Добавить в `scripts/cloud-init-template.yaml` после health check cron:

```yaml
# ── Health daemon (Self-Healing Ops) ──
- |
    cat > /opt/clawflow-health.sh << 'HEALTHEOF'
    [содержимое скрипта выше]
    HEALTHEOF
    chmod +x /opt/clawflow-health.sh
    sed -i "s/{{INSTANCE_ID}}/${INSTANCE_ID}/g" /opt/clawflow-health.sh
    sed -i "s/{{AUTO_HEAL}}/true/g" /opt/clawflow-health.sh
- |
    cat > /etc/systemd/system/clawflow-health.service << 'SHEOF'
    [Unit]
    Description=ClawFlow Health Check
    [Service]
    Type=oneshot
    ExecStart=/opt/clawflow-health.sh
    SHEOF
    cat > /etc/systemd/system/clawflow-health.timer << 'STEOF'
    [Unit]
    Description=ClawFlow Health Check Timer
    [Timer]
    OnBootSec=60
    OnUnitActiveSec=300
    [Install]
    WantedBy=timers.target
    STEOF
- systemctl daemon-reload
- systemctl enable --now clawflow-health.timer
```

### 4. Dashboard integration

Добавить в Settings tab:
- Toggle: "ריפוי אוטומטי" (Auto-Heal) — on/off
- Default: on
- Saves to instance config via API

В Developer tab → Server section:
- Показать последний health report (CPU/RAM/Disk/SSL)
- Alert history (последние 10 алертов)

### 5. DB migration

```sql
ALTER TABLE instances ADD COLUMN last_health_report JSONB;
ALTER TABLE instances ADD COLUMN last_health_at TIMESTAMPTZ;
ALTER TABLE instances ADD COLUMN auto_heal BOOLEAN DEFAULT true;
```

## Файлы для создания/изменения

| Файл | Действие |
|------|----------|
| `scripts/clawflow-health-daemon.sh` | Создать |
| `scripts/cloud-init-template.yaml` | Добавить health daemon |
| `apps/api/src/controllers/hosting/healthReport.ts` | Создать |
| `apps/api/src/controllers/hosting/index.ts` | Добавить export |
| `apps/api/src/routes/hosting.ts` | Добавить route |
| `apps/api/src/db/schema.ts` | Добавить columns |
| `apps/web/public/dashboard.html` | Settings toggle + server stats |
| DB migration | Run ALTER TABLE |

## Порядок реализации

1. Написать health daemon script
2. Создать API endpoint + DB migration
3. Добавить в cloud-init
4. Добавить toggle в Dashboard
5. Тест на существующем VPS (ssh, deploy script, verify reports)
6. Deploy
