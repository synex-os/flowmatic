# Step 11: Agent Integration Isolation — Per-Agent Credentials & UX

> Приоритет: СЕЙЧАС · Влияние: Architecture + UX · Блокер для multi-agent
> Зависимости: MCP Migration (09) завершён, Token Optimization (сессия Apr 12)
> Обновлено: Apr 13 — с учётом реального состояния кода

---

## Проблема

Сейчас все интеграции привязаны к **instance (VPS)**, не к **agent**.
Когда на одном VPS два агента (Personal + MATEH) — они делят:
- Один Telegram бот (должны быть разные)
- Один Google/Microsoft аккаунт (могут быть разные)
- Одни MCP серверы в openclaw.json
- Одни outputs в לוח תוכן (исправлено Apr 12, но credentials всё ещё shared)

**Результат:** пользователь добавляет MATEH, видит старые настройки Personal,
онбординг не чувствуется "свежим", интеграции перепутаны.

---

## Что уже сделано (Apr 12)

| Компонент | Статус | Файл |
|-----------|--------|------|
| `agent_integrations` таблица | ✅ Есть | `apps/api/src/db/schema.ts:357-377` |
| CRUD сервис | ✅ Есть | `apps/api/src/services/agentIntegrations.ts` |
| REST endpoints | ✅ Есть | `apps/api/src/controllers/hosting/agentIntegrationRoutes.ts` |
| Migration script legacy→new | ✅ Есть | `scripts/migrate-agent-integrations.sql` |
| OAuth dual-write (Google) | ✅ Пишет в обе таблицы | `apps/api/src/controllers/hosting/google.ts` |
| OAuth dual-write (Microsoft) | ✅ Пишет в обе таблицы | `apps/api/src/controllers/hosting/microsoft.ts` |
| Per-agent MCP lite servers | ✅ Написаны | `scripts/google-lite-mcp.js`, `scripts/ms365-lite-mcp.js` |

**Вывод:** Инфраструктура готова. Осталось завершить переход: добавить `agentType` в OAuth, перевести чтение на `agent_integrations`, убрать legacy.

---

## Полная карта интеграций

### Shared (один на все агенты)

| Интеграция | Почему shared | Примечание |
|---|---|---|
| **Anthropic API Key** | Один ключ → все модели | Биллинг общий |
| **OpenAI API Key** | Один ключ → все модели | Fallback |
| **Groq API Key** | Один ключ → бесплатные модели | |
| **Cerebras API Key** | Один ключ | |
| **Google Gemini Key** | Один ключ | |
| **Brave Search API** | Один ключ → все агенты ищут | $5/мес shared |
| **Replicate** | Один аккаунт генерации | |
| **BrightData** | Один прокси аккаунт | |
| **Ollama** | Один локальный сервер | |
| **Mem0** | Одна vector DB | Shared memory — feature, не баг |
| **Twenty CRM** | Одна CRM инстанция | Все агенты работают с одним CRM |

### Per-Agent (каждый агент — свой)

| Интеграция | Почему per-agent | Пример |
|---|---|---|
| **Telegram Bot** | Каждый агент = свой бот | Personal: @myhelper_bot, MATEH: @mymarketing_bot |
| **Google Workspace** | Personal = личный Gmail, MATEH = бизнес | personal@gmail.com vs ceo@company.co.il |
| **Microsoft 365** | Personal = личный Outlook, MATEH = бизнес | me@outlook.com vs team@company.com |
| **SMTP** | Разные email адреса для отправки | |
| **WordPress** | MATEH публикует в бизнес-блог | Personal не нужен WordPress |
| **Meta Ads** | Только MATEH | |
| **Instagram** | Только MATEH | |
| **WhatsApp** | Разные номера/аккаунты | |
| **Resend** | MATEH = рассылка клиентам | |

### Agent-Specific (показывать только для определённого типа)

| Интеграция | Доступна для | Не показывать для |
|---|---|---|
| **WordPress** | MATEH, Bare | Personal |
| **Meta Ads** | MATEH | Personal, Bare |
| **Instagram** | MATEH | Personal, Bare |
| **WhatsApp Business** | MATEH | Personal |
| **Google Ads** | MATEH | Personal |
| **Newsletter (Resend)** | MATEH | Personal |
| **Google Search Console** | MATEH | Personal |
| **DataForSEO** | MATEH | Personal |
| **Firecrawl** | MATEH | Personal |

---

## UX/UI Design — 3 зоны

```
┌──────────────────────────────────────────────────────────────┐
│  תוספים                                                      │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  🔧 תוספים משותפים                                      │ │
│  │  חלים על כל הסוכנים                                     │ │
│  │                                                         │ │
│  │  [Anthropic ✅] [OpenAI] [Groq ✅] [Cerebras]           │ │
│  │  [Gemini] [Ollama] [Brave ✅] [Replicate]               │ │
│  │  [BrightData] [Mem0 ✅ מובנה] [Twenty CRM]              │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ── סוכנים ──                                                │
│  [🤖 Personal ▾]  [📊 MATEH ▾]                              │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  🤖 OpenClaw Personal — תוספים ייעודיים                 │ │
│  │                                                         │ │
│  │  ערוצי תקשורת:                                          │ │
│  │  [📱 Telegram ✅ @myhelper_bot]                          │ │
│  │                                                         │ │
│  │  אימייל ויומן:                                          │ │
│  │  [📧 Google ✅ personal@gmail.com]                       │ │
│  │  [📧 Microsoft 365 — לא מחובר]                          │ │
│  │  [✉️ SMTP — לא מחובר]                                   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  📊 MATEH — תוספים ייעודיים                             │ │
│  │                                                         │ │
│  │  ערוצי תקשורת:                                          │ │
│  │  [📱 Telegram ✅ @marketing_bot]                         │ │
│  │  [💬 WhatsApp — לא מחובר]                               │ │
│  │                                                         │ │
│  │  אימייל ויומן:                                          │ │
│  │  [📧 Google ✅ ceo@company.co.il]                        │ │
│  │  [📧 Microsoft 365 ✅ team@company.com]                  │ │
│  │  [✉️ SMTP — לא מחובר]                                   │ │
│  │                                                         │ │
│  │  ערוצי פרסום:                                            │ │
│  │  [📝 WordPress ✅ blog.company.co.il]                    │ │
│  │  [📢 Meta Ads — לא מחובר]                               │ │
│  │  [📸 Instagram — לא מחובר]                              │ │
│  │                                                         │ │
│  │  SEO & נתונים:                                          │ │
│  │  [📊 Google Search Console — לא מחובר]                  │ │
│  │  [🔬 DataForSEO — לא מחובר]                             │ │
│  │  [🕷️ Firecrawl — לא מחובר]                              │ │
│  │  [📧 Resend Newsletter — לא מחובר]                      │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### UX Rules

1. **Shared section** — всегда видна, не зависит от выбранного агента
2. **Per-agent sections** — 1 агент: нет tabs, просто показывает. 2+ агентов: accordion/tabs
3. **Agent-specific integrations** — WordPress/Meta/Instagram НЕ показываются для Personal
4. **Connected status** — показывает username/email конкретного агента
5. **При подключении** — OAuth state содержит `agentType` → credentials сохраняются per-agent
6. **При добавлении нового агента** — "свежий" UI, shared показывает ✅, per-agent пусты

---

## Backend Architecture

### Current State (dual-write)

```
instances.googleTokens        ← legacy, читается в channelSync, agentSetup
instances.microsoftTokens     ← legacy, читается там же
instances.telegramBotToken    ← legacy
instances.telegramChatId      ← legacy

agent_integrations            ← новая таблица, пишется параллельно
  (instanceId, agentType, integrationType, config JSONB)
```

### Target State (single source of truth)

```
agent_integrations (единственный источник):
  ('abc123', 'oc', 'google',    { tokens: {...}, email: 'personal@gmail.com' })
  ('abc123', 'oc', 'telegram',  { botToken: '...', botUsername: '@myhelper_bot' })
  ('abc123', 'mt', 'google',    { tokens: {...}, email: 'ceo@company.co.il' })
  ('abc123', 'mt', 'telegram',  { botToken: '...', botUsername: '@marketing_bot' })
  ('abc123', 'mt', 'wordpress', { url: '...', user: '...', appPassword: '...' })

instances.googleTokens        ← УДАЛЕНО (или null, не читается)
instances.microsoftTokens     ← УДАЛЕНО
instances.telegramBotToken    ← УДАЛЕНО
```

### OAuth Flow Change (минимальное)

```
BEFORE:
/integrations/google/auth?instanceId=xxx&scopes=calendar,mail,contacts

AFTER:
/integrations/google/auth?instanceId=xxx&scopes=calendar,mail,contacts&agent=oc
                                                                      ^^^^^^^^
State includes agentType → callback saves ONLY to agent_integrations
```

### MCP Strategy (resolved conflict with 09)

**Решение:** суффиксы для per-agent, без суффикса для shared.

```json
{
  "mcpServers": {
    "brave-search": { "...": "shared, один процесс" },
    "google-workspace-oc": { "...": "Personal Google credentials" },
    "google-workspace-mt": { "...": "MATEH Google credentials" },
    "ms-365-oc": { "...": "Personal Microsoft" },
    "ms-365-mt": { "...": "MATEH Microsoft" }
  }
}
```

**RAM impact:** Каждый MCP lite server ~30-50MB (Node.js). 4 per-agent серверов = ~150-200MB.
На CX22 (4GB) с OpenClaw+n8n (~1.5GB used) — влезает. На CX22 с Ollama — НЕ влезает,
но Ollama требует минимум CX32 (8GB), где запас есть.

### Telegram Routing

Telegram routing на стороне **нашего API** (не openclaw.json):
- API хранит per-agent bot tokens в `agent_integrations`
- При отправке уведомлений: `telegram.sendMessage(instance, agentType)` → выбирает правильный токен
- OpenClaw channels config: наш provisioner генерирует per-agent channel binding

---

## Implementation Plan

### Phase 0: Audit (0.5 дня)

| Task | Description |
|------|-------------|
| Grep all reads from instances.googleTokens | Составить список файлов |
| Grep all reads from instances.microsoftTokens | |
| Grep all reads from instances.telegramBotToken | |
| Grep all reads from instances.telegramChatId | |
| Grep all reads from instances.metaTokens | |
| Map каждое чтение → замена на agent_integrations | Документировать в этом файле |

### Phase 1: Complete Migration (1.5 дня)

| Task | Description | Status |
|------|-------------|--------|
| Add `agent` param to Google OAuth state | ~10 строк в google.ts | NEW |
| Add `agent` param to Microsoft OAuth state | ~10 строк в microsoft.ts | NEW |
| Remove dual-write: stop writing to instances.googleTokens | google.ts callback | NEW |
| Remove dual-write: stop writing to instances.microsoftTokens | microsoft.ts callback | NEW |
| Switch channelSync.ts reads → agent_integrations | Main consumer of legacy | NEW |
| Switch agentSetup.ts reads → agent_integrations | Second consumer | NEW |
| Switch telegram.ts reads → agent_integrations | Bot token per-agent | NEW |
| Switch files.ts reads → agent_integrations | Credential deploy | NEW |
| Backward compat: if no `agent` param → default to active agent | Safety net | NEW |

### Phase 2: Frontend UI (2 дня)

| Task | Description |
|------|-------------|
| Redesign integrations tab — 3 zones | Shared / per-agent sections |
| Agent tabs/accordion | Show/hide per-agent, collapsed if 1 agent |
| Filter integrations by agent type | Hide WordPress/Meta for Personal |
| Connected status per-agent | Show "@bot_name" / "email@" per agent |
| OAuth redirect with agent param | Pass activeAgent in OAuth URL |
| Onboarding for new agent | Fresh state when adding MATEH |

### Phase 3: Per-Agent MCP Deployment (0.5 дня)

| Task | Description |
|------|-------------|
| Deploy per-agent MCP servers with suffix | google-workspace-oc, google-workspace-mt |
| Update cloud-init template | Per-agent MCP structure |
| Per-agent Telegram binding via provisioner | API-side routing, not openclaw.json |
| Agent isolation in openclaw.json | Each agent sees only its own tools |

### Phase 4: Testing + Cleanup (0.5 дня)

| Scenario | Test |
|---|---|
| Personal only | All integrations work normally |
| MATEH only | All integrations work normally |
| Personal + MATEH | Different Telegram, different Google, different outputs |
| Add MATEH to existing Personal | Personal keeps its integrations, MATEH starts fresh |
| Disconnect one agent's Google | Other agent's Google unaffected |
| OAuth reconnect | Correct agent receives updated tokens |
| **Cleanup** | Remove legacy columns from instances (or leave null) |

---

## Files to Change

| File | Phase | Changes |
|------|-------|---------|
| `apps/api/src/controllers/hosting/google.ts` | 1 | Add `agent` to OAuth state, remove dual-write |
| `apps/api/src/controllers/hosting/microsoft.ts` | 1 | Same |
| `apps/api/src/controllers/hosting/files.ts` | 1 | Read from agent_integrations, not instances |
| `apps/api/src/controllers/hosting/agentSetup.ts` | 1 | Read from agent_integrations |
| `apps/api/src/services/channelSync.ts` | 1 | Read per-agent credentials |
| `apps/api/src/services/telegram.ts` | 1 | Accept agentType, lookup per-agent token |
| `apps/web/public/dashboard.html` | 2 | Full integrations tab redesign (3 zones) |
| `scripts/cloud-init-template.yaml` | 3 | Per-agent MCP structure |

---

## Migration Strategy

### Existing users (backward compat)
- Run `migrate-agent-integrations.sql` (already written) to copy legacy → agent_integrations
- All existing integrations map to the user's active agent type
- After migration: reads go to agent_integrations only
- Legacy columns left as null (not dropped) for safety

### New users
- Fresh setup → writes only to agent_integrations
- Integrations tab shows shared + active agent sections
- Natural flow: add shared (API key), then per-agent (Telegram, Google)

---

## Оценка (обновлённая)

| Phase | Время | Примечание |
|-------|-------|------------|
| Phase 0: Audit | 0.5 дня | grep + map legacy reads |
| Phase 1: Complete Migration | 1.5 дня | OAuth + switch reads + remove dual-write |
| Phase 2: Frontend UI | 2 дня | 3-zone redesign dashboard.html |
| Phase 3: MCP Deployment | 0.5 дня | Суффиксы, cloud-init |
| Phase 4: Testing + Cleanup | 0.5 дня | All scenarios + remove legacy writes |
| **Итого** | **~5 дней** | (было 6, Phase 1 наполовину готова) |

---

## Связь с другими roadmap items

- **09-mcp-migration** — per-agent MCP servers extend the lite MCP approach (суффиксы для per-agent, без суффикса для shared)
- **10-seo-aeo-automation** — SEO tools are MATEH-only integrations
- **03-impact-dashboard** — per-agent metrics display
- **06-referral-program** — per-agent onboarding flow

---

## Tech Debt Note

`dashboard.html` — 8900+ строк, 512KB монолит. Рефакторинг в компоненты НЕ входит в scope этого плана, но каждое изменение в Phase 2 усложняет файл. Зафиксировать как отдельный roadmap item.
