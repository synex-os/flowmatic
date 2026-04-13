# Step 11: Agent Integration Isolation — Per-Agent Credentials & UX

> Приоритет: СЕЙЧАС · Влияние: Architecture + UX · Блокер для multi-agent
> Зависимости: MCP Migration (09) завершён, Token Optimization (сессия Apr 12)

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

## Полная карта интеграций

### Shared (один на все агенты)

| Интеграция | Почему shared | Примечание |
|---|---|---|
| **Anthropic API Key** | Один ключ → все модели (Haiku/Sonnet/Opus) | Биллинг общий |
| **OpenAI API Key** | Один ключ → все модели | Fallback |
| **Groq API Key** | Один ключ → бесплатные модели | |
| **Cerebras API Key** | Один ключ | |
| **Google Gemini Key** | Один ключ | |
| **Brave Search API** | Один ключ → все агенты ищут | $5/мес shared |
| **Replicate** | Один аккаунт генерации | |
| **BrightData** | Один прокси аккаунт | |
| **Ollama** | Один локальный сервер | |
| **Mem0** | Одна vector DB | Shared memory между агентами — feature, не баг |
| **Twenty CRM** | Одна CRM инстанция | Все агенты работают с одним CRM |

### Per-Agent (каждый агент — свой)

| Интеграция | Почему per-agent | Пример |
|---|---|---|
| **Telegram Bot** | Каждый агент = свой бот, свой username | Personal: @myhelper_bot, MATEH: @mymarketing_bot |
| **Google Workspace** | Personal = личный Gmail, MATEH = бизнес | personal@gmail.com vs ceo@company.co.il |
| **Microsoft 365** | Personal = личный Outlook, MATEH = бизнес | me@outlook.com vs team@company.com |
| **SMTP** | Разные email адреса для отправки | |
| **WordPress** | MATEH публикует в бизнес-блог | Personal не нужен WordPress |
| **Meta Ads** | Только MATEH | Personal не имеет Meta Ads |
| **Instagram** | Только MATEH | |
| **WhatsApp** | Разные номера/аккаунты | |
| **Resend** | MATEH = рассылка клиентам | |

### Agent-Specific (только для определённого типа)

| Интеграция | Доступна для | Не показывать для |
|---|---|---|
| **WordPress** | MATEH, Bare | Personal |
| **Meta Ads** | MATEH | Personal, Bare |
| **Instagram** | MATEH | Personal, Bare |
| **WhatsApp Business** | MATEH | Personal (возможно в будущем) |
| **Google Ads** | MATEH | Personal |
| **Newsletter (Resend)** | MATEH | Personal |
| **Google Search Console** | MATEH | Personal (lightweight в heartbeat) |
| **DataForSEO** | MATEH | Personal |
| **Firecrawl** | MATEH | Personal |

---

## UX/UI Design

### Принцип: 3 зоны

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
2. **Per-agent sections** — показываются collapsed/expanded. Если 1 агент — нет tabs, просто показывает. Если 2+ — accordion или tabs
3. **Agent-specific integrations** — WordPress/Meta/Instagram **не показываются** для Personal
4. **Connected status** — показывает username/email конкретного агента: "✅ @marketing_bot" vs "✅ @myhelper_bot"
5. **При подключении** — OAuth state содержит `agentType` → credentials сохраняются per-agent

### Onboarding Flow

При добавлении нового агента (MATEH):
1. Показать "свежий" интерфейс — без старых настроек Personal
2. Шаалон 11 вопросов
3. Per-agent integrations: Telegram bot, Email — пусты, нужно подключить
4. Shared integrations (Anthropic, Brave) — уже подключены, показать ✅

---

## Backend Architecture

### DB Schema Changes

```sql
-- Existing table (already has per-agent data, but not used for OAuth)
-- agent_integrations stores per-agent integration config

-- Need to add: per-agent OAuth tokens
ALTER TABLE agent_integrations ADD COLUMN oauth_tokens JSONB;
-- Example: { provider: 'google', accessToken: '...', refreshToken: '...', email: '...' }

-- OR: separate columns in instances table
-- instances.google_tokens → move to agent_integrations
-- instances.microsoft_tokens → move to agent_integrations
-- instances.telegram_bot_token → move to agent_integrations
```

### Current State → Target State

```
CURRENT:
instances.google_tokens          ← shared for all agents
instances.microsoft_tokens       ← shared
instances.telegram_bot_token     ← shared
instances.meta_tokens            ← shared

TARGET:
agent_integrations (instance_id, agent_type, integration_type, config)
  ('abc123', 'oc', 'google',    { tokens: {...}, email: 'personal@gmail.com' })
  ('abc123', 'oc', 'telegram',  { botToken: '...', botUsername: '@myhelper_bot' })
  ('abc123', 'mt', 'google',    { tokens: {...}, email: 'ceo@company.co.il' })
  ('abc123', 'mt', 'telegram',  { botToken: '...', botUsername: '@marketing_bot' })
  ('abc123', 'mt', 'wordpress', { url: '...', user: '...', appPassword: '...' })
```

### OAuth Flow Changes

```
CURRENT:
/integrations/google/auth?instanceId=xxx&scopes=calendar,mail,contacts

TARGET:
/integrations/google/auth?instanceId=xxx&scopes=calendar,mail,contacts&agent=oc
                                                                      ^^^^^^^^
State includes agentType → callback saves to agent_integrations, not instances
```

### MCP Deployment Changes

```
CURRENT:
openclaw.json → mcp.servers.google-workspace (one config)

TARGET:
openclaw.json → mcp.servers.google-workspace-oc (Personal Google)
              → mcp.servers.google-workspace-mt (MATEH Google)
              → mcp.servers.ms-365-oc (Personal Microsoft)
              → mcp.servers.ms-365-mt (MATEH Microsoft)

Per-agent MCP routing:
agents.list[0].tools.allow: ['google-workspace-oc', 'ms-365-oc']
agents.list[1].tools.allow: ['google-workspace-mt', 'ms-365-mt', 'wordpress', 'instagram']
```

### Telegram Per-Agent

```
CURRENT:
channels.telegram = { botToken: 'xxx', ... }  ← one bot for all

TARGET:
channels.telegram.accounts = {
  'default': { botToken: 'oc_bot_token', ... },  ← Personal
  'mateh':   { botToken: 'mt_bot_token', ... },  ← MATEH
}

Agent routing:
agents.list[0].routing = [{ channel: 'telegram', accountId: 'default' }]
agents.list[1].routing = [{ channel: 'telegram', accountId: 'mateh' }]
```

---

## Implementation Plan

### Phase 1: DB + Backend (2 дня)

| Task | Description |
|------|-------------|
| Migrate agent_integrations table | Add oauth_tokens column, indexes |
| Update Google OAuth | Accept `agent` param in auth/callback, save per-agent |
| Update Microsoft OAuth | Same |
| Update Telegram save | Save per-agent bot token |
| Update SMTP save | Save per-agent |
| Update WordPress save | Save per-agent (MATEH only) |
| Update Meta OAuth | Save per-agent (MATEH only) |
| MCP deploy | Deploy per-agent MCP servers with suffix (-oc, -mt) |
| Backward compat | If no agent param → save to default (oc) agent |

### Phase 2: Frontend UI (2 дня)

| Task | Description |
|------|-------------|
| Redesign integrations tab | 3 zones: shared, per-agent sections |
| Agent tabs/accordion | Show/hide per-agent integrations |
| Filter integrations by agent type | Hide WordPress/Meta for Personal |
| Connected status per-agent | Show "@bot_name" / "email@" per agent |
| OAuth redirect with agent param | Pass activeAgent in OAuth URL |
| Onboarding for new agent | Fresh state when adding MATEH |

### Phase 3: OpenClaw Config (1 день)

| Task | Description |
|------|-------------|
| Per-agent MCP routing | Deploy MCP servers with agent suffix |
| Per-agent Telegram binding | Multiple Telegram accounts + agent routing |
| Agent isolation in openclaw.json | Each agent sees only its own tools |

### Phase 4: Testing (1 день)

| Scenario | Test |
|---|---|
| Personal only | All integrations work normally |
| MATEH only | All integrations work normally |
| Personal + MATEH | Isolated: different Telegram, different Google, different outputs |
| Add MATEH to existing Personal | Personal keeps its integrations, MATEH starts fresh |
| Disconnect one agent's Google | Other agent's Google unaffected |
| OAuth reconnect | Correct agent receives updated tokens |

---

## Files to Change

| File | Phase | Changes |
|------|-------|---------|
| `apps/api/src/db/schema.ts` | 1 | agent_integrations: add oauth_tokens |
| `apps/api/src/controllers/hosting/google.ts` | 1 | Accept agent param, save per-agent |
| `apps/api/src/controllers/hosting/microsoft.ts` | 1 | Same |
| `apps/api/src/controllers/hosting/meta.ts` | 1 | Same |
| `apps/api/src/controllers/hosting/files.ts` | 1 | Telegram/SMTP save per-agent |
| `apps/api/src/controllers/hosting/agentSetup.ts` | 1 | Fresh onboarding for new agent |
| `apps/api/src/services/channelSync.ts` | 3 | Per-agent channel config |
| `apps/web/public/dashboard.html` | 2 | Full integrations tab redesign |
| `scripts/cloud-init-template.yaml` | 3 | Per-agent MCP structure |

---

## Migration Strategy

### Existing users (backward compat)
- If user has 1 agent → all existing integrations map to that agent
- If user adds second agent → existing integrations stay with first agent, second starts fresh
- No data loss, no broken flows

### New users
- Fresh setup → integrations tab shows shared + active agent sections
- Natural flow: add shared (API key), then per-agent (Telegram, Google)

---

## Оценка

| Phase | Время |
|-------|-------|
| Phase 1: DB + Backend | 2 дня |
| Phase 2: Frontend UI | 2 дня |
| Phase 3: OpenClaw Config | 1 день |
| Phase 4: Testing | 1 день |
| **Итого** | **~6 дней** |

---

## Связь с другими roadmap items

- **09-mcp-migration** — per-agent MCP servers extend the lite MCP approach
- **10-seo-aeo-automation** — SEO tools are MATEH-only integrations
- **03-impact-dashboard** — per-agent metrics display
- **06-referral-program** — per-agent onboarding flow
