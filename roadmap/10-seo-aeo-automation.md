# Step 10: SEO/AEO Automation Pipeline

> Приоритет: СЛЕДУЮЩИЙ · Влияние: Product Value · Тип клиента: MATEH
> Зависимости: MCP Migration (09) завершён, Activepieces API доступен

---

## Принцип

Агенты MATEH (סייר, מאתר, מגדלור) получают доступ к SEO/AEO данным
**без прямых API calls** — через Activepieces workflows, которые собирают
данные по расписанию и складывают в файлы на VPS. Агенты читают готовые
данные через `read` tool (500 tokens вместо 5-10K при прямом API call).

**Пользователь** подключает GSC через одну кнопку в Dashboard — всё остальное
создаётся автоматически.

---

## Архитектура

```
┌─────────────────────────────────────────────────┐
│                  Dashboard UI                    │
│  [Google Search Console]  [Ahrefs]  [Semrush]   │
│        ✅ מחובר          🔒 בקרוב   🔒 בקרוב    │
└──────────┬──────────────────────────────────────┘
           │ OAuth + API setup
           ▼
┌─────────────────────────────────────────────────┐
│              ClawFlow API (backend)              │
│                                                  │
│  1. OAuth token → DB                            │
│  2. Activepieces API → create workflows         │
│  3. VPS → create /workspace/seo-data/ dir       │
└──────────┬──────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│           Activepieces (on client VPS)           │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐ │
│  │ Daily    │  │ Weekly   │  │ Monthly       │ │
│  │ GSC Pull │  │ SEO      │  │ AEO Audit     │ │
│  │ 06:00    │  │ Report   │  │ 1st of month  │ │
│  │          │  │ Sun 05:00│  │ 04:00         │ │
│  └────┬─────┘  └────┬─────┘  └──────┬────────┘ │
│       │             │               │           │
│       ▼             ▼               ▼           │
│  gsc-daily.json  weekly.json   aeo-monthly.json │
│       │             │               │           │
│       └─────────────┼───────────────┘           │
│                     │                           │
│           /workspace/seo-data/                  │
└─────────────────────┬───────────────────────────┘
                      │ read tool (файлы)
                      ▼
┌─────────────────────────────────────────────────┐
│              OpenClaw Agents (MATEH)             │
│                                                  │
│  סייר ← gsc-daily.json (тренды, аномалии)      │
│  מאתר ← weekly.json (keyword opportunities)     │
│  מגדלור ← aeo-monthly.json (AI citations)       │
│  מנתח ← all files (стратегический анализ)       │
│  עט ← insights от מנתח (контент-план)           │
│                                                  │
│  מטה (orchestrator) → Telegram отчёт            │
└─────────────────────────────────────────────────┘
```

---

## Данные которые собираем

### Daily (Activepieces → GSC API, каждый день 06:00)

```json
{
  "date": "2026-04-13",
  "top_queries": [
    {
      "query": "סוכן AI לעסקים",
      "clicks": 45,
      "impressions": 1200,
      "ctr": 0.0375,
      "position": 4.2,
      "change_vs_yesterday": { "clicks": +5, "position": -0.3 }
    }
  ],
  "top_pages": [
    {
      "page": "/blog/openclaw-complete-guide-2026",
      "clicks": 120,
      "impressions": 3400,
      "position": 2.1
    }
  ],
  "index_coverage": {
    "valid": 42,
    "errors": 0,
    "warnings": 2,
    "new_issues": []
  },
  "alerts": [
    { "type": "traffic_drop", "page": "/pricing", "drop_pct": -25, "period": "24h" }
  ]
}
```

### Weekly (Activepieces, воскресенье 05:00)

```json
{
  "period": "2026-04-06 to 2026-04-12",
  "summary": {
    "total_clicks": 890,
    "total_impressions": 24500,
    "avg_ctr": 0.036,
    "avg_position": 5.8,
    "vs_prev_week": { "clicks": "+12%", "impressions": "+8%", "position": "-0.4" }
  },
  "keyword_opportunities": [
    {
      "query": "openclaw הגדרה",
      "impressions": 450,
      "clicks": 8,
      "position": 12.3,
      "opportunity": "high — high impressions, low position, can improve"
    }
  ],
  "competitor_check": [
    {
      "query": "סוכן AI ישראל",
      "our_position": 4,
      "competitor_positions": {
        "competitor-a.co.il": 1,
        "competitor-b.com": 3
      }
    }
  ],
  "content_performance": {
    "best": { "page": "/blog/guide", "clicks": 320 },
    "worst": { "page": "/pricing", "clicks": 5 },
    "declining": ["/blog/old-post"]
  }
}
```

### Monthly AEO (Activepieces, 1-е число 04:00)

```json
{
  "month": "2026-04",
  "brand_mentions_in_ai": {
    "chatgpt": {
      "query": "מהו OpenClaw?",
      "mentioned": true,
      "citation_url": "flowmatic.co.il/blog/...",
      "position_in_answer": "first_paragraph"
    },
    "perplexity": {
      "query": "best AI agent hosting Israel",
      "mentioned": true,
      "citation_url": "flowmatic.co.il"
    },
    "claude": {
      "query": "OpenClaw hosting",
      "mentioned": false,
      "note": "not cited, competitor cited instead"
    },
    "gemini": {
      "query": "סוכן AI אישי",
      "mentioned": false
    }
  },
  "competitor_ai_presence": {
    "competitor-a.co.il": { "cited_in": ["chatgpt", "perplexity"], "total": 2 },
    "our_brand": { "cited_in": ["chatgpt", "perplexity"], "total": 2 }
  },
  "recommendations": [
    "Add FAQ schema to /pricing page — ChatGPT prefers structured answers",
    "Competitor-A ranks for 'AI agent for business' in Perplexity — create dedicated page"
  ]
}
```

---

## Activepieces Workflow Templates

### Template 1: GSC Daily Pull

```yaml
name: "SEO — Daily GSC Data"
trigger:
  type: schedule
  cron: "0 6 * * *"  # Every day at 06:00
  timezone: Asia/Jerusalem

steps:
  - name: gsc_auth
    type: google_search_console
    action: authenticate
    config:
      oauth_token: "{{instance.google_tokens.access_token}}"
      refresh_token: "{{instance.google_tokens.refresh_token}}"
      site_url: "{{instance.website_url}}"

  - name: fetch_queries
    type: google_search_console
    action: search_analytics_query
    config:
      start_date: "{{today - 1 day}}"
      end_date: "{{today}}"
      dimensions: ["query"]
      row_limit: 20
      order_by: "clicks DESC"

  - name: fetch_pages
    type: google_search_console
    action: search_analytics_query
    config:
      start_date: "{{today - 1 day}}"
      end_date: "{{today}}"
      dimensions: ["page"]
      row_limit: 10
      order_by: "clicks DESC"

  - name: fetch_index_coverage
    type: google_search_console
    action: index_coverage
    config:
      site_url: "{{instance.website_url}}"

  - name: detect_anomalies
    type: code
    config:
      language: javascript
      code: |
        // Compare with yesterday's data
        const fs = require('fs');
        const prevPath = '/workspace/seo-data/gsc-daily.json';
        let prev = {};
        try { prev = JSON.parse(fs.readFileSync(prevPath)); } catch {}

        const alerts = [];
        // Check for traffic drops > 20%
        const prevClicks = prev.summary?.total_clicks || 0;
        const todayClicks = steps.fetch_queries.reduce((s, q) => s + q.clicks, 0);
        if (prevClicks > 0 && todayClicks < prevClicks * 0.8) {
          alerts.push({ type: 'traffic_drop', drop_pct: Math.round((todayClicks/prevClicks - 1) * 100) });
        }
        return { alerts, todayClicks };

  - name: save_to_file
    type: ssh_exec
    config:
      command: |
        cat > /workspace/seo-data/gsc-daily.json << 'JSONEOF'
        {{JSON.stringify(result)}}
        JSONEOF

  - name: alert_if_needed
    type: condition
    config:
      condition: "{{steps.detect_anomalies.alerts.length > 0}}"
      if_true:
        - type: openclaw_message
          config:
            message: "⚠️ SEO Alert: {{steps.detect_anomalies.alerts[0].type}} — {{steps.detect_anomalies.alerts[0].drop_pct}}% drop"
            channel: telegram
```

### Template 2: Weekly SEO Report

```yaml
name: "SEO — Weekly Report"
trigger:
  type: schedule
  cron: "0 5 * * 0"  # Sunday 05:00
  timezone: Asia/Jerusalem

steps:
  - name: gsc_weekly
    type: google_search_console
    action: search_analytics_query
    config:
      start_date: "{{today - 7 days}}"
      end_date: "{{today}}"
      dimensions: ["query"]
      row_limit: 50

  - name: gsc_prev_week
    type: google_search_console
    action: search_analytics_query
    config:
      start_date: "{{today - 14 days}}"
      end_date: "{{today - 7 days}}"
      dimensions: ["query"]
      row_limit: 50

  - name: competitor_check
    type: brave_search
    action: search
    config:
      queries:
        - "{{instance.brand_name}} {{instance.industry}}"
        - "{{instance.primary_keyword}}"
        - "{{instance.competitor_1}}"

  - name: build_report
    type: code
    config:
      language: javascript
      code: |
        // Compare weeks, find opportunities, build report JSON
        // ...save to /workspace/seo-data/weekly.json

  - name: trigger_agent_analysis
    type: openclaw_message
    config:
      message: "דוח SEO שבועי מוכן. קרא /workspace/seo-data/weekly.json ושלח סיכום עם המלצות."
      channel: internal  # triggers סייר → מנתח → מטה chain
```

### Template 3: Monthly AEO Audit

```yaml
name: "AEO — Monthly AI Visibility Audit"
trigger:
  type: schedule
  cron: "0 4 1 * *"  # 1st of month, 04:00
  timezone: Asia/Jerusalem

steps:
  - name: check_chatgpt
    type: brave_search
    action: search
    config:
      query: "site:chatgpt.com {{instance.brand_name}}"
      # Fallback: use OpenClaw browser to ask ChatGPT directly

  - name: check_perplexity
    type: http_request
    config:
      url: "https://api.perplexity.ai/chat/completions"
      method: POST
      body:
        model: "llama-3.1-sonar-small-128k-online"
        messages:
          - role: user
            content: "{{instance.aeo_query}}"
      # Check if our brand is cited

  - name: check_competitors
    type: brave_search
    action: search
    config:
      queries:
        - "{{instance.competitor_1}} {{instance.industry}}"
        - "{{instance.competitor_2}} {{instance.industry}}"

  - name: build_aeo_report
    type: code
    config:
      language: javascript
      code: |
        // Build AEO report JSON
        // ...save to /workspace/seo-data/aeo-monthly.json

  - name: trigger_migdalor
    type: openclaw_message
    config:
      message: "דוח AEO חודשי מוכן. קרא /workspace/seo-data/aeo-monthly.json ושלח ביקורת מלאה."
      channel: internal  # triggers מגדלור analysis
```

---

## Dashboard UI — Карточка GSC

### Расположение

Dashboard → Integrations → секция "נתונים וחיפוש" (рядом с Brave Search)

### UI States

**State 1 — Not connected:**
```
┌─────────────────────────────────────────┐
│ 📊 Google Search Console     לא מחובר  │
│                                         │
│ ניטור SEO אוטומטי — דוח יומי,         │
│ מעקב מיקומים, התראות על ירידות         │
│                                         │
│ [URL של האתר: ____________]            │
│ [→ חברו Google Search Console]          │
│                                         │
│ 💡 דורש חשבון Google עם גישה ל-GSC     │
└─────────────────────────────────────────┘
```

**State 2 — Connected:**
```
┌─────────────────────────────────────────┐
│ 📊 Google Search Console    ✅ מחובר    │
│                                         │
│ אתר: flowmatic.co.il                   │
│ דוח יומי: 06:00 ✓                      │
│ דוח שבועי: ראשון 05:00 ✓              │
│ ביקורת AEO: 1 לחודש ✓                 │
│                                         │
│ [📋 צפו בדוח אחרון]  [🔌 נתקו]        │
└─────────────────────────────────────────┘
```

### OAuth Flow

1. User clicks "חברו"
2. OAuth redirect to Google (same client ID as Google Workspace)
3. Additional scope: `https://www.googleapis.com/auth/webmasters.readonly`
4. Callback saves token + creates Activepieces workflows via API
5. First data pull runs immediately

---

## Backend Implementation

### Файлы для создания/изменения

| Файл | Действие | Описание |
|------|----------|----------|
| `apps/api/src/controllers/hosting/gsc.ts` | Создать | OAuth + status + reports |
| `apps/api/src/services/activepieces-api.ts` | Создать | Программное создание workflows |
| `apps/api/src/routes/hosting.ts` | Изменить | Добавить GSC routes |
| `apps/web/public/dashboard.html` | Изменить | Карточка GSC в интеграциях |
| `scripts/activepieces-templates/` | Создать | JSON templates для workflows |
| `scripts/cloud-init-template.yaml` | Изменить | Pre-create seo-data directory |
| `templates/mateh-system/workspace/AGENTS.md` | Изменить | Добавить SEO data reading instructions |

### API Routes

```
GET  /hosting/integrations/gsc/auth          → OAuth redirect
GET  /hosting/integrations/gsc/callback       → Token exchange + workflow creation
GET  /hosting/integrations/gsc/status         → Connection status + last report
GET  /hosting/integrations/gsc/report         → Latest report data
POST /hosting/integrations/gsc/disconnect     → Remove workflows + tokens
```

### Activepieces API Integration

```typescript
// apps/api/src/services/activepieces-api.ts

export class ActivepiecesAPI {
    private baseUrl: string  // http://localhost:8080/api/v1
    private apiKey: string

    // Create workflow from template
    async createFlow(template: object): Promise<string>

    // Enable/disable workflow
    async toggleFlow(flowId: string, enabled: boolean): Promise<void>

    // Delete workflow
    async deleteFlow(flowId: string): Promise<void>

    // List flows by tag
    async listFlows(tag: string): Promise<Flow[]>
}
```

### GSC Controller

```typescript
// apps/api/src/controllers/hosting/gsc.ts

export const gscAuth = async (c: Context) => {
    // Same Google OAuth client, additional scope: webmasters.readonly
    // Save website URL from user input
}

export const gscCallback = async (c: Context) => {
    // 1. Exchange code for tokens
    // 2. Save GSC tokens to DB (separate from Google Workspace tokens)
    // 3. Create Activepieces workflows via API:
    //    - Daily GSC pull
    //    - Weekly SEO report
    //    - Monthly AEO audit (only for MATEH)
    // 4. Create /workspace/seo-data/ directory on VPS
    // 5. Run first data pull immediately
    // 6. Redirect to dashboard
}

export const gscDisconnect = async (c: Context) => {
    // 1. Delete Activepieces workflows
    // 2. Clear tokens from DB
    // 3. Remove /workspace/seo-data/ from VPS
}
```

---

## MATEH Agent Updates

### AGENTS.md — добавить SEO routing

```markdown
## ניתוב SEO

| משימה | סוכן | מקור נתונים |
|-------|------|-------------|
| ירידות תנועה | סייר | seo-data/gsc-daily.json |
| הזדמנויות מילות מפתח | מאתר | seo-data/weekly.json |
| ביקורת AEO חודשית | מגדלור | seo-data/aeo-monthly.json |
| אסטרטגיה ותוכנית תוכן | מנתח | כל הקבצים |
| כתיבת תוכן ממוקד SEO | עט | insights ממנתח |

## כלל חשוב
אל תקרא ל-API ישירות. קרא את הקבצים ב-/workspace/seo-data/.
הנתונים מתעדכנים אוטומטית על ידי Activepieces.
```

### HEARTBEAT.md — добавить SEO check

```markdown
## שבועי (ראשון, 08:00)
**SEO Weekly Review**
- קרא seo-data/weekly.json
- סכם שינויים מרכזיים
- שלח ב-Telegram:
  - 📈 מילות מפתח שעלו/ירדו
  - 🎯 הזדמנויות חדשות
  - ⚠️ בעיות שזוהו
```

---

## Ahrefs / Semrush — Phase 2

### Ahrefs MCP (когда пользователь подписан)

```json
{
  "command": "npx",
  "args": ["-y", "@anthropic/ahrefs-mcp-server"],
  "env": {
    "AHREFS_API_KEY": "..."
  }
}
```

**Важно:** Ahrefs API стоит от $99/мес — это premium feature.
Добавляем в Dashboard как отдельную карточку с пометкой "דורש מנוי Ahrefs".

Ahrefs MCP даёт агентам:
- Backlink analysis
- Keyword explorer
- Site audit
- Content gap analysis
- Rank tracking

### Semrush MCP

```json
{
  "command": "npx",
  "args": ["-y", "@anthropic/semrush-mcp-server"],
  "env": {
    "SEMRUSH_API_KEY": "..."
  }
}
```

Semrush MCP даёт:
- Trends API (market analysis, traffic estimates)
- Standard API (keyword data, backlink profiles)
- Domain analytics

### Dashboard UI для Phase 2

```
┌─────────────────────────────────────────┐
│ 📊 Ahrefs                   לא מחובר   │
│                                         │
│ ניתוח בקלינקים, מחקר מילות מפתח,      │
│ ניתוח מתחרים ומעקב דירוגים             │
│                                         │
│ [API Key: ____________]                 │
│ [→ שמרו]                               │
│                                         │
│ 💰 דורש מנוי Ahrefs ($99+/חודש)       │
└─────────────────────────────────────────┘
```

---

## AEO Monitoring — Phase 3

### Выделенный AEO workflow

Специальный Activepieces workflow для מגדלור:

1. **Brave Search** — ищет `"brand_name" site:reddit.com`, `"brand_name" review`
2. **Perplexity API** — задаёт ключевые вопросы, проверяет цитируется ли бренд
3. **OpenClaw Browser** — заходит в ChatGPT Web, задаёт вопрос, скриншотит ответ
4. **Comparison** — сравнивает с прошлым месяцем
5. **Report** — JSON с рекомендациями

### Schema.org Enhancement

עט генерирует Schema.org markup на основе данных от מגדלור:
- FAQPage schema для страниц с вопросами
- HowTo schema для гайдов
- Organization schema с sameAs links
- Article schema с author + dateModified

Это повышает вероятность цитирования в AI ответах на 2.3x
(по данным [Conductor AEO/GEO Benchmarks Report 2026](https://www.conductor.com/academy/aeo-geo-benchmarks-report/)).

---

## Метрики успеха

| KPI | Как измеряется | Цель (3 мес) |
|-----|---------------|-------------|
| GSC clicks weekly trend | weekly.json | +15% MoM |
| Keyword positions top 10 | gsc-daily.json | +20 keywords |
| AI citation count | aeo-monthly.json | Cited in 3+ AI platforms |
| Content published from insights | עט output | 4 articles/month |
| SEO issues resolved | מאתר alerts | <3 open issues |

---

## Оценка трудозатрат

| Phase | Что | Время | Приоритет |
|-------|-----|-------|-----------|
| **Phase 1** | GSC OAuth + Daily pull + Dashboard card | 2-3 дня | HIGH |
| **Phase 1** | Activepieces API integration | 1-2 дня | HIGH |
| **Phase 1** | Weekly report workflow | 1 день | HIGH |
| **Phase 1** | Agent AGENTS.md + HEARTBEAT.md updates | 0.5 дня | HIGH |
| **Phase 2** | Ahrefs MCP integration | 1 день | MEDIUM |
| **Phase 2** | Semrush MCP integration | 1 день | MEDIUM |
| **Phase 3** | AEO monthly audit workflow | 2 дня | MEDIUM |
| **Phase 3** | Schema.org auto-generation | 1 день | LOW |
| **Testing** | End-to-end test all workflows | 2 дня | HIGH |
| | **Итого Phase 1** | **~7 дней** | |
| | **Итого всё** | **~14 дней** | |

---

## Риски и решения

| Риск | Вероятность | Решение |
|------|------------|---------|
| GSC API rate limits (100 req/day) | Низкая — 1-3 запроса/день | Кеширование, batch queries |
| Activepieces API changes | Средняя | Версионировать templates, pin API version |
| AEO data unreliable (AI ответы нестабильны) | Высокая | Мониторить тренды, не единичные ответы |
| Ahrefs/Semrush API costs for users | Высокая | Чётко указывать стоимость, предлагать бесплатные альтернативы |
| Token consumption spike при анализе | Средняя | Файлы ограничены по размеру, агенты читают summary |

---

## Связь с существующими roadmap items

- **09-mcp-migration.md** — GSC/Ahrefs/Semrush = новые MCP серверы в каталоге
- **03-impact-dashboard.md** — SEO метрики отображаются в Impact Dashboard
- **05-google-business-profile.md** — GBP данные дополняют SEO отчёт
- **02-llm-router.md** — SEO анализ = complex task → Sonnet, daily pull reading = Haiku
