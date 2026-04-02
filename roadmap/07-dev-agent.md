# Step 7: Dev Agent v1 — Scout + Reporter

> Приоритет: Неделя 3-4 · Усилие: 5 дня · Влияние: Moat
> Только для нас (Flowmatic team). Мониторит технологии, предлагает улучшения.
> Решения принимаем вместе, раз в неделю.

## Цель

Автономный агент который:
1. Сканирует GitHub, HuggingFace, HN, ProductHunt на релевантные обновления
2. Оценивает влияние на ClawFlow
3. Каждое воскресенье — Hebrew Telegram brief с находками
4. Мы вместе решаем что внедряем

## Архитектура

```
Dev Agent (на management VPS)
├── Scout (каждые 6ч)
│   ├── GitHub trending: mcp, ai-agent, hebrew-nlp, openclaw
│   ├── HuggingFace: новые Hebrew модели
│   ├── HN: AI agent mentions, OpenClaw mentions
│   └── ProductHunt: AI tools launch
├── Evaluator
│   └── Claude scoring: hebrew_impact, agent_capability, cost_delta, threat_level
├── Reporter (воскресенье 08:00)
│   └── Hebrew Telegram brief → Sergei
└── Memory (Mem0)
    └── Что уже видели, что внедрили, что отклонили
```

## Что мониторим

| Источник | Что ищем | Частота |
|----------|---------|---------|
| GitHub trending | repos с тегами: mcp, ai-agent, openclaw, hebrew, mem0 | 6ч |
| GitHub releases | OpenClaw releases, Mem0 releases, Qdrant releases | 6ч |
| HuggingFace | Новые Hebrew LLM/embedding модели | Daily |
| Hacker News | Упоминания OpenClaw, AI agents, Hebrew NLP | 6ч |
| ProductHunt | AI agent tools, automation launches | Daily |
| Anthropic blog | Claude updates, new features, pricing changes | Daily |
| OpenAI blog | GPT updates, API changes | Daily |

## Evaluator — scoring каждой находки

```typescript
interface Finding {
  source: string         // github|hf|hn|ph|anthropic|openai
  title: string
  url: string
  summary: string        // 2-3 sentences
  scores: {
    hebrew_impact: number    // 0-100: улучшит Hebrew capabilities?
    agent_capability: number // 0-100: даст агентам новые возможности?
    cost_delta: number       // -100 to +100: удешевит или удорожит?
    threat_level: number     // 0-100: конкурент? надо реагировать?
    effort: number           // 0-100: сколько работы внедрить?
  }
  recommendation: 'investigate' | 'integrate' | 'monitor' | 'ignore'
  risk: 'LOW' | 'MEDIUM' | 'HIGH'
}
```

Scoring prompt для Claude:
```
Evaluate this finding for ClawFlow — Israeli AI agent hosting platform.
Our stack: OpenClaw, Hetzner VPS, Mem0, n8n/Activepieces, Hebrew-first.
Score 0-100 on each dimension. Be harsh — only HIGH scores matter.
```

## Reporter — Weekly Brief

Каждое воскресенье 08:00 Jerusalem → Telegram:

```
🔭 *Dev Agent — סיכום שבועי*

📦 *חדש השבוע:*
1. [HIGH] OpenClaw v2026.4.2 — new ContextEngine hooks
   Hebrew impact: 45 | Capability: 82 | Cost: 0
   → Recommendation: integrate — improves memory recall
   
2. [MEDIUM] claude-haiku-4-5 price drop 20%
   Cost delta: -20 | Effort: 5
   → Auto-update router config

3. [LOW] New Hebrew embedding model on HF
   Hebrew: 72 | Effort: 30
   → Monitor — test on staging first

⚠️ *threats:*
- Competitor "AIHost.co.il" launched — basic hosting, no agents
  Threat: 35 | No action needed

📊 *Stats:* 47 findings scanned, 3 relevant, 0 auto-implemented

[Full report →]
```

## Реализация

### 1. Scout cron jobs (management VPS)

```typescript
// apps/api/src/jobs/dev-agent-scout.ts

// GitHub trending
async function scoutGitHub() {
  const topics = ['mcp', 'ai-agent', 'openclaw', 'hebrew-nlp', 'mem0']
  for (const topic of topics) {
    const repos = await fetch(`https://api.github.com/search/repositories?q=topic:${topic}&sort=updated&per_page=10`)
    // Filter: created or updated in last 6 hours
    // Save new findings to dev_agent_findings table
  }
}

// GitHub releases — specific repos
async function scoutReleases() {
  const repos = ['anthropics/openclaw', 'mem0ai/mem0', 'qdrant/qdrant', 'n8n-io/n8n']
  for (const repo of repos) {
    const releases = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=3`)
    // Check if new since last scan
  }
}

// HuggingFace — Hebrew models
async function scoutHuggingFace() {
  const models = await fetch('https://huggingface.co/api/models?search=hebrew&sort=lastModified&limit=10')
  // Filter: new in last 24h
}

// Hacker News
async function scoutHN() {
  const results = await fetch('https://hn.algolia.com/api/v1/search_by_date?query=openclaw+OR+"ai+agent"&tags=story')
  // Filter: last 6 hours, >5 points
}
```

### 2. DB schema

```sql
CREATE TABLE dev_agent_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50),          -- github|hf|hn|ph|anthropic|openai
  title VARCHAR(500),
  url TEXT,
  summary TEXT,
  scores JSONB,                -- {hebrew_impact, agent_capability, cost_delta, threat_level, effort}
  recommendation VARCHAR(50),  -- investigate|integrate|monitor|ignore
  risk VARCHAR(10),            -- LOW|MEDIUM|HIGH
  status VARCHAR(50) DEFAULT 'new', -- new|reviewed|implemented|dismissed
  reviewed_at TIMESTAMPTZ,
  notes TEXT,                  -- наши заметки при review
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE dev_agent_weekly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start DATE,
  total_scanned INTEGER,
  relevant_count INTEGER,
  findings JSONB,              -- array of finding summaries
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3. Weekly review workflow

Каждое воскресенье мы:
1. Получаем Telegram brief
2. Отвечаем на каждый finding:
   - "👍" → status: 'implement' (ты берёшь в работу)
   - "👎" → status: 'dismissed'
   - "🔍" → status: 'investigate' (нужно больше info)
3. Mem0 запоминает решения: "мы отклонили X потому что Y"

### 4. Memory (Mem0) integration

Dev Agent использует Mem0 на management VPS (не на client):
- Помнит что уже видел (no duplicate alerts)
- Помнит что мы решили по каждой находке
- Помнит наши предпочтения ("не интересуют Python-only tools")

### 5. Cron schedule

```
# Scout (management VPS crontab)
0 */6 * * * node /opt/openclaw-hosting/apps/api/src/jobs/dev-agent-scout.js
# Weekly report (Sunday 08:00 Jerusalem)
0 8 * * 0 node /opt/openclaw-hosting/apps/api/src/jobs/dev-agent-report.js
```

## Risk classification (для будущего Auto-Implementer)

v1 — только Scout + Reporter. Но готовим структуру:

```typescript
const AUTO_RULES = {
  // LOW — можно автоматически (v2+)
  'model_price_change': 'LOW',
  'mcp_server_new': 'LOW',

  // MEDIUM — PR + manual review
  'claude_version_bump': 'MEDIUM',
  'dependency_update': 'MEDIUM',

  // HIGH — только proposal
  'new_integration': 'HIGH',
  'architecture_change': 'HIGH',
  'breaking_change': 'HIGH',
}
```

В v1 — всё через Telegram brief. Никаких авто-действий.

## Файлы для создания/изменения

| Файл | Действие |
|------|----------|
| `apps/api/src/jobs/dev-agent-scout.ts` | Создать — scouts |
| `apps/api/src/jobs/dev-agent-report.ts` | Создать — weekly report |
| `apps/api/src/db/schema.ts` | 2 новые таблицы |
| DB migration | CREATE TABLE × 2 |

НЕ трогаем: client VPS, dashboard, cloud-init. Это internal tool.

## Порядок реализации

1. DB migration
2. Scout functions (GitHub, HF, HN)
3. Evaluator (Claude scoring prompt)
4. Reporter (Telegram brief formatter)
5. Cron setup на management VPS
6. Mem0 integration на management VPS
7. Тест: run scout → verify findings → generate report
