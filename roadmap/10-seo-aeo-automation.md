# Step 10: SEO/AEO/GEO Automation Engine

> Приоритет: СЛЕДУЮЩИЙ · Влияние: Core Product Value · Тип: MATEH + Personal
> Зависимости: MCP Migration (09) завершён

---

## Контекст — что изменилось в индустрии (апрель 2026)

### Новая реальность
SEO больше не про "ключевые слова и бэклинки". В 2026 году три поля битвы:

1. **SEO** — классический поиск Google (по-прежнему ~60% трафика)
2. **GEO** (Generative Engine Optimization) — видимость в AI Overviews Google
3. **AEO** (Answer Engine Optimization) — цитирование в ChatGPT, Perplexity, Claude, Gemini

**Ключевые цифры:**
- 74.2% всех AI цитат приходят из контента, который также ранжируется в традиционном поиске
- Страницы с SEO + AEO оптимизацией получают 2.3x больше видимости
- 40-60% цитат в AI меняются ежемесячно — нужен постоянный мониторинг
- ChatGPT = 87.4% всего AI referral traffic на сайты

### Инструменты нового поколения

| Инструмент | Что изменилось | Статус |
|---|---|---|
| **DataForSEO MCP** | Pay-per-query вместо $99/мес подписки. SERP, keywords, backlinks, AI visibility — всё через MCP | Production-ready |
| **Frase.io** | Единственный инструмент покрывающий все 6 стадий: Research → Strategy → Write → Audit → Monitor → Fix. Read-write MCP | Production-ready |
| **claude-seo skill** | Open-source SEO skill: 19 sub-skills, 12 subagents, DataForSEO + Firecrawl + image gen | MIT, production |
| **SEObuild** | AI agent пишет страницы которые Google ранжирует И LLM цитируют. Entity consensus, 500-token chunks | Open-source |
| **llms.txt** | Новый стандарт — файл для AI crawler'ов. Аналог robots.txt для LLM | Early adoption |
| **Firecrawl MCP** | Full-site crawling через MCP. Агент сам может сканировать любой сайт | Production-ready |

### Сдвиг парадигмы: от "данные → отчёт" к "research → publish → monitor → fix"

**Старый подход (мой первый roadmap):**
```
Activepieces cron → GSC API → JSON file → агент читает → отчёт
```
Проблема: агент **только анализирует**, не **действует**.

**Новый подход (индустрия 2026):**
```
Агент автономно: находит gaps → пишет контент → оптимизирует schema → публикует → мониторит ранжирование → чинит если упало
```
Полный цикл. Human-in-the-loop только на этапе approve.

---

## Архитектура — 6-Stage Pipeline

```
┌──────────────────────────────────────────────────────────────┐
│                     MATEH SEO/AEO Engine                     │
│                                                              │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐                   │
│  │ RESEARCH│──▸│STRATEGY │──▸│  WRITE  │                   │
│  │ סייר    │   │ מנתח    │   │ עט      │                   │
│  └─────────┘   └─────────┘   └────┬────┘                   │
│       │                           │                          │
│       │    ┌──────────────────────┘                          │
│       │    │                                                 │
│  ┌────▼────▼──┐   ┌─────────┐   ┌─────────┐               │
│  │   AUDIT   │──▸│ MONITOR │──▸│   FIX   │               │
│  │ מאתר     │   │ מגדלור  │   │ עט+שליח │               │
│  └───────────┘   └─────────┘   └─────────┘               │
│                                                              │
│  Data Layer:                                                 │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐        │
│  │DataForSEO│ │ GSC API  │ │Firecrawl │ │Brave    │        │
│  │  MCP     │ │  MCP     │ │  MCP     │ │Search   │        │
│  └─────────┘ └──────────┘ └──────────┘ └─────────┘        │
│                                                              │
│  Output Layer:                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐       │
│  │WordPress │ │Schema.org│ │llms.txt  │ │Telegram │       │
│  │  MCP     │ │ auto-gen │ │ auto-gen │ │ reports │       │
│  └──────────┘ └──────────┘ └──────────┘ └─────────┘       │
└──────────────────────────────────────────────────────────────┘
```

### Stage 1: RESEARCH (סייר)
**Что делает:** Находит что писать и по каким ключевым словам.
**Как:**
- DataForSEO MCP → keyword gaps vs конкуренты
- DataForSEO MCP → SERP analysis (кто ранжируется, какой контент)
- Firecrawl MCP → crawl конкурентов, извлечь структуру контента
- Brave Search → Reddit/HN мнения, реальные вопросы аудитории
- GSC MCP → impressions без кликов = opportunities (видят но не кликают)

**Output:** `workspace/seo-data/research-brief.json`

### Stage 2: STRATEGY (מנתח)
**Что делает:** Анализирует данные, приоритизирует, создаёт контент-план.
**Как:**
- Читает research-brief.json
- Entity consensus analysis (какие факты подтверждаются 2+ источниками)
- Gap analysis: что есть у конкурентов и нет у нас
- Keyword clustering по intent (informational, transactional, navigational)
- ROI scoring: estimated traffic × conversion potential

**Output:** `workspace/seo-data/content-plan.json` + summary в Telegram

### Stage 3: WRITE (עט)
**Что делает:** Пишет контент оптимизированный для Google И AI цитирования.
**Как:**
- 200-char AI Summary Nugget в начале (для Perplexity/ChatGPT цитирования)
- 500-token chunk architecture (совпадает с Google AI retrieval window)
- Entity consensus — каждый факт верифицирован 2+ источниками
- Schema.org автогенерация (FAQ, HowTo, Article)
- De-AI-ify: не звучать как AI (MATEH правило #4)
- Internal linking strategy

**Output:** Markdown draft → Telegram для approve → WordPress publish

### Stage 4: AUDIT (מאתר)
**Что делает:** Технический SEO аудит сайта клиента.
**Как:**
- Firecrawl MCP → full-site crawl
- Проверка: битые ссылки, дубли title/meta, медленные страницы
- Schema.org validation
- Core Web Vitals (DataForSEO PageSpeed API)
- llms.txt генерация и обновление
- Mobile-friendliness

**Output:** `workspace/seo-data/audit-report.json` + приоритизированный список fixes

### Stage 5: MONITOR (מגדלור)
**Что делает:** Мониторинг ранжирования в Google И видимости в AI.
**Как:**
- GSC MCP → daily position tracking
- DataForSEO MCP → SERP tracking ключевых запросов
- DataForSEO AI Visibility → проверка LLM citations (ChatGPT, Perplexity, Claude)
- Brave Search → brand mention monitoring
- Alert система: ранжирование упало >3 позиции → alert в Telegram

**Output:** Weekly digest + instant alerts

### Stage 6: FIX (עט + שליח)
**Что делает:** Автоматическое восстановление упавших позиций.
**Как:**
- Detect: מגדלור нашёл падение → trigger
- Diagnose: מנתח анализирует причину (конкурент обновил? алгоритм? контент устарел?)
- Fix: עט обновляет контент, добавляет свежие данные, усиливает E-E-A-T
- Publish: שליח публикует обновлённую версию через WordPress MCP
- Verify: מגדלור проверяет через 7 дней — позиция восстановилась?

**Output:** Updated content + Telegram report

---

## MCP Server Stack

### Tier 1 — Бесплатно или почти бесплатно

| MCP Server | Что даёт | Auth | Стоимость |
|---|---|---|---|
| **GSC MCP** (Composio или native) | Clicks, impressions, CTR, positions, index coverage | Google OAuth | Бесплатно |
| **Brave Search MCP** | Web search, competitor monitoring | API key | $5/мес бесплатный кредит |
| **Firecrawl MCP** | Full-site crawling, content extraction | API key | 500 pages/мес бесплатно |

### Tier 2 — Pay-per-query (вместо подписки)

| MCP Server | Что даёт | Стоимость |
|---|---|---|
| **DataForSEO MCP** | SERP data, keywords, backlinks, AI visibility, PageSpeed | ~$0.002-0.01 per query |

**Экономика DataForSEO vs Ahrefs/Semrush:**
- Ahrefs Lite: $99/мес фиксированно
- DataForSEO: ~$5-15/мес при 500-1500 queries
- Для MATEH агента 500 queries/мес = **~$5** вместо $99

### Tier 3 — Premium (если клиент подписан)

| MCP Server | Что даёт | Стоимость |
|---|---|---|
| **Ahrefs MCP** | Backlinks, keyword explorer, content gap, site audit | $99+/мес (подписка клиента) |
| **Semrush MCP** | Trends API, domain analytics, keyword data | $129+/мес (подписка клиента) |
| **Frase MCP** | 6-stage pipeline, AI search tracking, content optimization | $49/мес |

---

## llms.txt — Новый стандарт

### Что это
Файл `/llms.txt` — аналог `robots.txt` для AI crawler'ов. Markdown-файл в корне сайта, который говорит LLM: "вот мои главные страницы, вот о чём они".

### Почему важно
- Claude уже поддерживает llms.txt в документации
- Повышает точность AI ответов о вашем бренде
- Low-cost signal: 20-50 ссылок, обновлять раз в месяц

### Реализация в ClawFlow
מגדלור автоматически генерирует и обновляет `llms.txt` при каждом AEO аудите:

```markdown
# flowmatic.co.il

> Flowmatic builds AI agent hosting tools for the Israeli market.

## Main Pages
- [ClawFlow — AI Agent Hosting](https://clawflow.flowmatic.co.il): Deploy AI agents in 3 minutes
- [Complete OpenClaw Guide](https://flowmatic.co.il/blog/openclaw-complete-guide-2026): Step-by-step setup guide
- [MATEH Marketing Agents](https://flowmatic.co.il/blog/mateh-guide): 8 sub-agents for autonomous marketing

## Documentation
- [Pricing](https://clawflow.flowmatic.co.il/pricing)
- [Privacy Policy](https://flowmatic.co.il/privacy)
- [Contact](https://flowmatic.co.il/contact)
```

---

## Entity Consensus — ключевая концепция 2026

### Проблема
AI модели не доверяют одному источнику. Они ищут **консенсус** — факт подтверждённый несколькими независимыми источниками.

### Решение для контента (עט)
Каждый key claim в статье должен быть верифицирован:
- Fact → Source 1 (official docs)
- Fact → Source 2 (industry report)
- Fact → Source 3 (expert quote)

**Процесс סייר → עט:**
1. סייר ищет через Brave/DataForSEO: какие факты о теме подтверждаются 2+ источниками
2. מנתח фильтрует: оставляет только подтверждённые claims
3. עט строит контент вокруг verified claims
4. Каждый параграф = 500 tokens max (Google AI retrieval window)
5. AI Summary Nugget (200 chars) вверху страницы — для мгновенного цитирования

### Результат
Контент написанный по entity consensus ранжируется в Google И цитируется AI.
Это то что делает SEObuild — "pages Google ranks AND LLMs cite".

---

## Dashboard UX

### Новая секция: "SEO & AI Visibility"

```
Dashboard → Integrations → נתונים וחיפוש

┌─────────────────────────────────────────┐
│ 📊 Google Search Console     לא מחובר  │
│                                         │
│ ניטור מיקומים, תנועה, שגיאות אינדוקס  │
│ דוחות יומיים ושבועיים אוטומטיים        │
│                                         │
│ [URL האתר: ____________]               │
│ [→ חברו GSC]                            │
│ 💡 חינם — דורש חשבון Google             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🔬 DataForSEO              לא מחובר    │
│                                         │
│ מחקר מילות מפתח, ניתוח מתחרים,        │
│ בקלינקים, נראות ב-AI — לפי שימוש      │
│                                         │
│ [API Key: ____________]                 │
│ [→ שמרו]                               │
│ 💡 ~$5/חודש (500 שאילתות)              │
│    חלופה חסכונית ל-Ahrefs ($99/חודש)   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🕷️ Firecrawl                לא מחובר   │
│                                         │
│ סריקת אתרים מלאה — ניתוח טכני,        │
│ מיפוי תוכן מתחרים, בדיקת קישורים      │
│                                         │
│ [API Key: ____________]                 │
│ [→ שמרו]                               │
│ 💡 500 דפים/חודש חינם                   │
└─────────────────────────────────────────┘
```

### Agent Config — SEO режים

В Dashboard → Agents → Settings:

```
┌─────────────────────────────────────────┐
│ 🎯 SEO/AEO Pipeline                    │
│                                         │
│ ☑ דוח יומי (GSC positions + alerts)    │
│ ☑ דוח שבועי (trends + opportunities)   │
│ ☑ ביקורת AEO חודשית (AI visibility)    │
│ ☐ כתיבת תוכן אוטומטית (draft→approve) │
│ ☐ ranking recovery אוטומטי             │
│                                         │
│ 💡 כל תוכן עובר אישור לפני פרסום       │
└─────────────────────────────────────────┘
```

---

## Agent Updates

### MATEH AGENTS.md — SEO Routing

```markdown
## SEO/AEO Pipeline (6 שלבים)

| שלב | סוכן | מקור נתונים | פעולה | מודל |
|-----|------|-------------|-------|------|
| Research | סייר | DataForSEO MCP, Brave, Firecrawl | מחקר gaps + keywords | haiku |
| Strategy | מנתח | research output | תוכנית תוכן + ROI scoring | sonnet |
| Write | עט | content plan | כתיבת תוכן + schema + AI nugget | sonnet |
| Audit | מאתר | Firecrawl, GSC | technical SEO audit + llms.txt | haiku |
| Monitor | מגדלור | GSC, DataForSEO AI Visibility | ranking + AI citation tracking | haiku |
| Fix | עט+שליח | monitoring alerts | content refresh + republish | sonnet |

## כללי SEO content
- Entity consensus: כל עובדה מאומתת מ-2+ מקורות
- 500-token chunks: מותאם ל-Google AI retrieval window
- AI Summary Nugget: 200 תווים בראש כל עמוד — לציטוט ב-AI
- Schema.org: FAQ, HowTo, Article — נוצר אוטומטית
- De-AI-ify: תוכן לא נשמע כמו AI כתב אותו
```

### Personal AGENTS.md — Lightweight SEO

```markdown
## SEO (אם GSC מחובר)
- בודק GSC פעם ביום ב-heartbeat
- מדווח על ירידות תנועה > 20%
- מציע שיפורים בתוכן קיים
- לא כותב תוכן חדש (רק MATEH)
```

---

## Файлы для создания/изменения

| Файл | Phase | Описание |
|------|-------|----------|
| `apps/api/src/controllers/hosting/gsc.ts` | 1 | GSC OAuth + status + data pull |
| `apps/api/src/controllers/hosting/dataforseo.ts` | 1 | DataForSEO API key save + MCP deploy |
| `apps/api/src/controllers/hosting/firecrawl.ts` | 1 | Firecrawl API key save + MCP deploy |
| `apps/api/src/routes/hosting.ts` | 1 | Новые routes |
| `apps/web/public/dashboard.html` | 1 | 3 новые карточки интеграций |
| `apps/api/src/controllers/hosting/mcp.ts` | 1 | Добавить GSC, DataForSEO, Firecrawl в каталог |
| `scripts/cloud-init-template.yaml` | 1 | Pre-install MCP packages |
| `templates/mateh-system/workspace/AGENTS.md` | 1 | SEO pipeline routing |
| `templates/mateh-system/workspace/HEARTBEAT.md` | 1 | SEO monitoring tasks |
| `templates/personal-system/workspace/AGENTS.md` | 1 | Lightweight GSC check |
| `scripts/gsc-lite-mcp.js` | 2 | Lightweight GSC MCP (если нужен) |
| Agent SOUL.md updates | 2 | Entity consensus instructions |
| llms.txt auto-generation | 3 | מגדלור generates + deploys |

---

## Оценка

| Phase | Что | Время |
|-------|-----|-------|
| **Phase 1: Data Layer** | GSC + DataForSEO + Firecrawl MCP + Dashboard cards | 3-4 дня |
| **Phase 2: Agent Intelligence** | AGENTS.md updates, entity consensus, content pipeline | 2-3 дня |
| **Phase 3: Automation** | llms.txt, schema auto-gen, ranking recovery workflow | 2-3 дня |
| **Testing** | End-to-end: research → write → publish → monitor → fix | 2 дня |
| **Итого** | | **~10-12 дней** |

---

## Конкурентное преимущество ClawFlow

Никто из конкурентов не предлагает **full-stack SEO/AEO в hosted AI agent**:

| Решение | Research | Write | Audit | Monitor | Fix | Hosted |
|---------|----------|-------|-------|---------|-----|--------|
| Frase | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ SaaS |
| Ahrefs | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ SaaS |
| claude-seo | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ Local |
| SEObuild | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ Local |
| **ClawFlow MATEH** | ✅ | ✅ | ✅ | ✅ | ✅ | **✅ Hosted** |

ClawFlow MATEH = единственное решение где весь 6-stage pipeline работает
автономно на hosted VPS, с 8 специализированными агентами, по цене ₪169/мес
+ ~$5/мес на DataForSEO. Вместо $99 Ahrefs + $49 Frase + self-hosting.

---

## Sources

- [DataForSEO MCP Server](https://dataforseo.com/blog/dataforseo-mcp-server-bridging-the-gap-between-ai-models-and-seo-data)
- [claude-seo: 19 sub-skills, 12 subagents](https://github.com/AgriciDaniel/claude-seo)
- [SEObuild: pages Google ranks AND LLMs cite](https://github.com/gbessoni/seobuild-onpage)
- [Frase AI Agents for SEO — 6-Stage Pipeline](https://www.frase.io/blog/ai-agents-for-seo)
- [MCP Servers for SEO — Frase.io](https://www.frase.io/blog/mcp-servers-for-seo)
- [Top SEO MCP Servers 2026 — SEOptimer](https://www.seoptimer.com/blog/seo-mcp/)
- [AI Agents for SEO Complete Guide — ALM Corp](https://almcorp.com/blog/ai-agents-for-seo/)
- [SEO's new battleground: consensus layer](https://searchengineland.com/seos-new-battleground-winning-the-consensus-layer-472001)
- [llms.txt specification guide](https://www.bluehost.com/blog/what-is-llms-txt/)
- [AEO/GEO Benchmarks Report 2026 — Conductor](https://www.conductor.com/academy/aeo-geo-benchmarks-report/)
- [Best AEO Tools 2026 — Scrunch](https://scrunch.com/blog/best-answer-engine-optimization-aeo-generative-engine-optimization-geo-tools-2026)
- [Technical SEO for generative search](https://searchengineland.com/technical-seo-generative-search-optimizing-ai-agents-473039)
