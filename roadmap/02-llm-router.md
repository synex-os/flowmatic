# Step 2: LLM Router — оптимизация токенов

> Приоритет: Неделя 1 · Усилие: 4 дня · Влияние: Margin
> Снижает расходы клиента с $18-25 до $3-5/мес

## Цель

Интеллектуальная маршрутизация задач к разным AI моделям.
Дешёвые задачи → дешёвые модели. Client-facing контент → дорогие модели.
Работает на client VPS. Клиент может переконфигурировать.

## Принцип

Каждый вызов AI оценивается по 4 параметрам:
- `task_type` — parse, classify, draft, final, strategy, code
- `complexity` — low, medium, high
- `language` — he, en
- `is_client_facing` — видит ли клиент результат

## Тиры маршрутизации

| Тир | Когда | Модель | Цена |
|-----|-------|--------|------|
| 0 | Парсинг, дедупликация, форматирование | TypeScript (без LLM) | $0.00 |
| 1 | Internal + English + low complexity + Ollama есть | Ollama (phi4-mini / qwen2.5:7b) | $0.00 |
| 2 | Hebrew + не client-facing, или medium complexity | Claude Haiku | -90% vs Sonnet |
| 2b | Long context batch classification | Gemini Flash | -95% vs Sonnet |
| 3 | Финальный Hebrew контент для публикации | Claude Sonnet | Полная цена |
| 3+ | Strategy, Extended Thinking | Claude Opus | Максимум |

## Распределение задач MATEH

| Агент | Задача | Тир | Модель |
|-------|--------|-----|--------|
| סייר | Парсинг RSS/HTML | 0 | TypeScript |
| סייר | Дедупликация URL | 0 | TypeScript |
| מנתח | Классификация контента | 1 | Ollama Phi-4 (если есть) → Haiku |
| מאתר | SEO теги (черновик) | 2 | Haiku |
| עט | Черновик Hebrew поста | 2 | Haiku |
| עט | Финальный Hebrew пост | 3 | Sonnet |
| מגדלור | Monthly AEO audit | 3+ | Sonnet + Extended |
| יוצר | Описание к изображению | 2 | Haiku |
| שליח | WhatsApp шаблон | 2 | Haiku |
| Personal | Daily briefing | 2 | Haiku |
| Personal | Email draft | 2 | Haiku → клиент правит |
| Personal | Complex research | 3 | Sonnet |

## Реализация

### 1. Router module

Файл: `templates/shared/llm-router-config.json`

Устанавливается на каждый VPS при provisioning. OpenClaw читает из AGENTS.md.

```json
{
  "routing_rules": [
    {
      "match": { "agent": ["sayer"], "task": ["parse", "dedup", "format"] },
      "action": "skip_llm",
      "note": "Use TypeScript code, no LLM call"
    },
    {
      "match": { "client_facing": false, "language": "en", "complexity": "low" },
      "prefer": "ollama",
      "fallback": "haiku"
    },
    {
      "match": { "client_facing": false, "language": "he" },
      "prefer": "haiku",
      "fallback": "sonnet"
    },
    {
      "match": { "client_facing": true, "task": ["final_post", "newsletter", "wa_template"] },
      "prefer": "sonnet",
      "fallback": "haiku"
    },
    {
      "match": { "task": ["strategy", "aeo_audit", "market_research"] },
      "prefer": "opus",
      "fallback": "sonnet"
    }
  ],
  "models": {
    "ollama": { "provider": "ollama", "model": "phi4-mini", "cost_per_1k": 0 },
    "haiku": { "provider": "anthropic", "model": "claude-haiku-4-5-20251001", "cost_per_1k": 0.0008 },
    "sonnet": { "provider": "anthropic", "model": "claude-sonnet-4-6", "cost_per_1k": 0.003 },
    "opus": { "provider": "anthropic", "model": "claude-opus-4-6", "cost_per_1k": 0.015 },
    "flash": { "provider": "google", "model": "gemini-2.0-flash", "cost_per_1k": 0.0001 }
  }
}
```

### 2. AGENTS.md routing instructions

Добавить в MATEH и Personal AGENTS.md templates:

```markdown
## Model Routing
Use the cheapest model that maintains quality:
- Internal analysis, parsing, classification → Haiku
- Draft content (Hebrew, not final) → Haiku
- Final content for publishing → Sonnet
- Strategy, deep research → Opus (request permission for Opus)
- Always report which model you used
```

### 3. Dashboard — model usage tracker

В Developer tab или Settings:
- Таблица: модель × количество вызовов × estimated cost за период
- Pie chart: распределение по моделям
- Клиент видит экономию: "сэкономлено $X vs если бы всё шло через Sonnet"

### 4. Token usage tracking

API endpoint для client VPS → reports model usage:

```typescript
POST /hosting/instances/:id/usage-report
Body: { model: string, input_tokens: number, output_tokens: number, task_type: string }
```

Агрегируем для Impact Dashboard (файл 3).

## Файлы для создания/изменения

| Файл | Действие |
|------|----------|
| `templates/shared/llm-router-config.json` | Создать |
| `templates/mateh-system/workspace/AGENTS.md` | Добавить routing section |
| `templates/personal-system/workspace/AGENTS.md` | Добавить routing section |
| `apps/api/src/controllers/hosting/usage.ts` | Создать — usage tracking |
| `apps/api/src/routes/hosting.ts` | Добавить route |
| `apps/web/public/dashboard.html` | Usage stats display |
| `scripts/cloud-init-template.yaml` | Deploy router config |

## Порядок реализации

1. Создать router config JSON
2. Обновить AGENTS.md templates с routing instructions
3. Создать usage tracking endpoint
4. Добавить в cloud-init
5. Dashboard: usage display
6. Тест: verify разные задачи идут к разным моделям
