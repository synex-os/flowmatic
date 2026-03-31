# ПЛАН: GTM + Маркетолог — Полная система
## Flowmatic / Kol Voice AI / Gius.xyz
## Версия 2.0 | Март 2026 | После полного исследования community

---

## КОНТЕКСТ

**Что строим:** 9-агентного AI-маркетолога на OpenClaw.
Competitive intelligence + стратегия + creative + content + distribution + AEO.

**Для чего:** Личное использование (FM/Kol/Gius) + обучающий контент + HaaS продукт.

**Публикация:** Все файлы → GitHub (open source) | Видео → YouTube | Пост → flowmatic.co.il

**Формат видео:**
```
[0:00–2:00]   Business Overview — что получишь, на языке бизнеса
[2:00–15:00]  Quick Win — один агент, первый Daily Brief в Telegram
[15:00–end]   Full Expert System — полная 9-агентная архитектура
```

---

## ЧАСТЬ 1 — ИМЕНА АГЕНТОВ (на иврите)

Принцип именования: каждое имя — слово из израильской культуры/военного/делового контекста, понятное местной ЦА. Не перевод, а смысл.

```
┌─────────────────────────────────────────────────────────────────┐
│  АГЕНТ          ИМЯ (ивр.)    ПРОИЗНОШЕНИЕ   СМЫСЛ              │
├─────────────────────────────────────────────────────────────────┤
│  Orchestrator   מטה           Mateh          Штаб (военный)     │
│  Scout-Web      סייר          Sayer          Разведчик          │
│  Scout-SERP     מאתר          Me'ater        Локатор/Искатель   │
│  Scout-Social   מאזין         Ma'azin        Слушатель          │
│  Analyst        מנתח          Menate'ach     Аналитик           │
│  Writer         עט            Et             Перо (писатель)    │
│  Creative       יוצר          Yotzer         Творец/Создатель   │
│  Distribution   שליח          Shali'ach      Посланник          │
│  AEO Monitor    מגדלור        Migdalor       Маяк               │
└─────────────────────────────────────────────────────────────────┘
```

**Почему эти имена:**
- **מטה** — в Израиле все знают "מטה" как штаб. Orchestrator = штаб который координирует.
- **סייר** — разведывательная рота. Уходит в интернет и приносит данные.
- **מאזין** — "слушает" что говорят люди в соцсетях. Точная метафора.
- **מנתח** — аналитик разведки. Превращает данные в решения.
- **עט** — "перо". Простое, красивое, понятное.
- **יוצר** — создатель контента. "Yotzer" — это и Бог-создатель и дизайнер.
- **שליח** — посланник. Доставляет контент в мир.
- **מגדלור** — маяк. Следит чтобы нас "видели" AI-системы.

---

## ЧАСТЬ 2 — АРХИТЕКТУРА 9 АГЕНТОВ

### Обновлённая схема (после исследования community)

```
מטה (Mateh) — Orchestrator
    │
    ├── [РАЗВЕДКА — параллельно]
    │   ├── סייר (Sayer)      → Bright Data Web Unlocker
    │   ├── מאתר (Me'ater)    → Bright Data SERP + programmatic-seo
    │   └── מאזין (Ma'azin)   → Xpoz (Reddit/Twitter/LinkedIn IL)
    │
    ├── [АНАЛИЗ]
    │   └── מנתח (Menate'ach) → Opportunity scoring, pattern recognition
    │
    ├── [СОЗДАНИЕ — последовательно]
    │   ├── עט (Et)           → Пишет текст (+ de-ai-ify внутри)
    │   └── יוצר (Yotzer)     → Создаёт изображения (image-gen/Replicate)
    │
    └── [ДИСТРИБУЦИЯ + МОНИТОРИНГ]
        ├── שליח (Shali'ach)  → adaptlypost (все платформы) + ghost-cms
        └── מגדלור (Migdalor) → AEO audit + citation tracking (1x/мес)
```

### Когда какие агенты активны

```
Ежедневно (Cron):
  מטה → только он один → Daily Brief (Haiku — дёшево)

Еженедельно (Cron, пн 8:00):
  מטה → סייר + מאזין (параллельно) → מנתח → עט → Telegram для одобрения

По запросу (ad-hoc):
  "Создай пост" → מטה → עט → יוצר → שליח (после одобрения)
  "Конкурентный анализ" → מטה → все 3 Scout → מנתח → Telegram

Ежемесячно (1-го числа):
  מגדלור → полный AEO audit → отчёт в Telegram
```

---

## ЧАСТЬ 3 — НОВЫЙ КРИТИЧЕСКИЙ ФАЙЛ: BRAND.md

**Главное открытие исследования:** без Brand Memory агент пишет generic контент.
Brand Memory = файл который знает voice, positioning, past campaigns, что работало.

### Три версии BRAND.md (по продукту)

```
workspace/
├── brands/
│   ├── flowmatic/BRAND.md    ← голос FM
│   ├── kol/BRAND.md          ← голос Kol
│   └── gius/BRAND.md         ← голос Gius
```

### Структура каждого BRAND.md

```markdown
# BRAND — [название продукта]

## Позиционирование
- Одна фраза: "[кому] помогает делать [что] без [чего]"
- Главное отличие от конкурентов: [конкретно]
- Что мы НИКОГДА не говорим: [список]

## Голос
- Тон: [примеры]
- Стиль предложений: [короткие/длинные, активный/пассивный]
- Слова которые используем: [список]
- Слова которые не используем: [список]
- Референс: "Пишем как [известный человек/бренд] объяснял бы [ЦА]"

## Аудитория
- Главный персонаж: [кто, чем занимается, что болит]
- Что их останавливает от покупки: [реальные возражения]
- Что их убеждает: [реальные триггеры]

## Что работало
- Лучший пост за всё время: [URL + почему сработал]
- Лучший хук: [текст]
- Худший пост: [почему провалился]

## Контент-пилларс (3-5 тем)
- [тема 1]: [почему важна для нас]
- [тема 2]: ...

## CTA по умолчанию
- LinkedIn: [текст]
- Email: [текст]
- Telegram: [текст]
```

---

## ЧАСТЬ 4 — ПОЛНАЯ ФАЙЛОВАЯ АРХИТЕКТУРА

```
~/.openclaw/
├── workspace/                          ← главный workspace (Mateh)
│   ├── SOUL.md                         ← личность מטה
│   ├── AGENTS.md                       ← правила + model routing
│   ├── HEARTBEAT.md                    ← Cron расписание (НЕ Heartbeat!)
│   ├── USER.md                         ← наши продукты + конкуренты
│   ├── MEMORY.md                       ← долгосрочная память
│   ├── memory/
│   │   └── YYYY-MM-DD.md              ← ежедневные записи
│   └── brands/
│       ├── flowmatic/BRAND.md          ← 🆕 голос FM
│       ├── kol/BRAND.md                ← 🆕 голос Kol
│       └── gius/BRAND.md               ← 🆕 голос Gius
│
├── agents/
│   ├── sayer/                          ← סייר
│   │   ├── SOUL.md
│   │   └── output/latest.json         ← file-based handoff
│   ├── meater/                         ← מאתר
│   │   ├── SOUL.md
│   │   └── output/latest.json
│   ├── maazin/                         ← מאזין
│   │   ├── SOUL.md
│   │   └── output/latest.json
│   ├── menateach/                      ← מנתח
│   │   ├── SOUL.md
│   │   └── output/latest.json
│   ├── et/                             ← עט
│   │   ├── SOUL.md
│   │   └── output/latest.json
│   ├── yotzer/                         ← יוצר
│   │   ├── SOUL.md
│   │   └── output/latest.json
│   ├── shaliach/                       ← שליח
│   │   ├── SOUL.md
│   │   └── output/latest.json
│   └── migdalor/                       ← מגדלור
│       ├── SOUL.md
│       └── output/latest.json
│
└── openclaw.json                       ← главный конфиг
```

### File-based handoffs (лучшая практика community)

**Ключевое решение:** агенты НЕ передают данные через сообщения.
Они пишут в `output/latest.json` → следующий агент читает оттуда.

```
סייר пишет:    agents/sayer/output/latest.json
מאתר пишет:    agents/meater/output/latest.json
מאזין пишет:   agents/maazin/output/latest.json
מנתח читает все три → пишет: agents/menateach/output/latest.json
עט читает мнтч → пишет:      agents/et/output/latest.json
יוצר читает ет → пишет:      agents/yotzer/output/latest.json
שליח читает оба → публикует (после одобрения)
```

---

## ЧАСТЬ 5 — DEPLOYMENT WIZARD BOT (для нон-тех пользователей)

### Концепция

**Проблема:** Большинство людей застрянут на шаге "создать USER.md вручную".
**Решение:** Telegram-бот который ведёт за ручку от нуля до работающей системы.

Это одновременно:
- Инструмент онбординга для обучающего контента
- Готовый HaaS-продукт (клиент разворачивает сам, мы помогаем только если застрял)
- Open source → репутация + входящий трафик

### Как это работает

```
Пользователь пишет боту в Telegram:
"Хочу настроить AI маркетолога"

Бот ведёт диалог:
├── Шаг 1: Сбор данных о бизнесе (5-7 вопросов)
├── Шаг 2: Генерирует USER.md + BRAND.md автоматически
├── Шаг 3: Проверяет VPS (пингует Hostinger API)
├── Шаг 4: Деплоит файлы на VPS через SSH/API
├── Шаг 5: Устанавливает Skills через clawhub
├── Шаг 6: Тестирует — запрашивает первый Daily Brief
└── Шаг 7: Подтверждает что всё работает
```

### Диалог — пример онбординга

```
🤖 Бот: Привет! Я помогу настроить AI-маркетолога за 15 минут.
        Ответь на несколько вопросов голосом или текстом.
        Начнём?

👤 Да

🤖 Бот: 1/7 — Как называется твой бизнес и чем занимаешься?
        (можно голосовым)

👤 [голосовое] "Flowmatic, SaaS для автоматизации маркетинга..."

🤖 Бот: Записал. 2/7 — Кто твои главные конкуренты?
        Назови 2-3 сайта или названия.

...после всех вопросов...

🤖 Бот: Генерирую файлы для твоей системы...
        ✅ USER.md создан
        ✅ BRAND.md создан
        
        Теперь нужен VPS. У тебя уже есть Hostinger?
        [Да, есть] [Нет, помоги настроить]

🤖 Бот: [если Да] Отлично! Отправь мне Gateway Token
        (найдёшь в Hostinger → VPS → OpenClaw)

...

🤖 Бот: ✅ Все файлы загружены
        ✅ Skills установлены
        ✅ Тест прошёл — агент отвечает
        
        Завтра в 7:00 ты получишь первый Daily Brief.
        Хочешь посмотреть пример прямо сейчас?
```

### Технические варианты реализации

**Вариант A — OpenClaw сам как бот (рекомендуется)**

Специальный агент-онбордер развёрнут на нашем VPS.
Пользователи пишут ему в Telegram.
Он собирает данные, генерирует файлы, деплоит через SSH на их VPS.

```
Стек:
- OpenClaw на нашем VPS (flowmatic.co.il)
- Отдельный Telegram бот для онбординга
- Claude Sonnet для генерации файлов
- SSH skill для деплоя на VPS клиента
- Anthropic API (наш ключ → включаем в HaaS цену)
```

**Плюсы:** Полностью в OpenClaw экосистеме. Показываем возможности платформы.
**Минусы:** Нужно хранить SSH credentials клиентов — security риск.

**Вариант B — GitHub Actions + форма**

Пользователь заполняет форму на flowmatic.co.il → GitHub Action генерирует персонализированный ZIP → скачивает и вручную загружает на VPS.

```
Стек:
- Next.js форма (уже есть)
- GitHub Actions для генерации
- ZIP с готовыми файлами
```

**Плюсы:** Никаких security рисков. Просто.
**Минусы:** Пользователь всё равно должен сам загружать файлы.

**Вариант C — Telegram бот + Hostinger API (ЛУЧШИЙ)**

Hostinger имеет API. Бот получает API token от пользователя → деплоит напрямую через Hostinger API, без SSH.

```
Стек:
- Telegram bot (Node.js или Python)
- Hostinger VPS API (официальный)
- Claude API для генерации файлов
- clawhub CLI для установки Skills
```

**Плюсы:** Нет SSH риска. Официальный API. Полный автодеплой.
**Минусы:** Нужно написать бота с нуля (~500-700 строк).

### Рекомендация

**Фаза 1 (для контента и HaaS):** Вариант B — форма + ZIP.
Быстро. Работает. Достаточно для первого видео.

**Фаза 2 (после первых 10 HaaS клиентов):** Вариант C — полный Telegram бот.
Это и продукт, и контент ("смотрите как бот разворачивает систему за 15 минут").

### Голосовые команды — сравнение платформ

```
┌──────────────┬────────────┬──────────────────────────────────────┐
│  Платформа   │  Цена      │  Голос для бота                      │
├──────────────┼────────────┼──────────────────────────────────────┤
│  Telegram    │  Бесплатно │  ✅ Голосовые сообщения + Whisper     │
│              │            │  Идеально. Наш выбор.                │
├──────────────┼────────────┼──────────────────────────────────────┤
│  Discord     │  Бесплатно │  ⚠️ Голос в каналах — да.            │
│              │            │  Голос боту в ЛС — сложно, нужна    │
│              │            │  отдельная интеграция                │
├──────────────┼────────────┼──────────────────────────────────────┤
│  Slack       │  Платно    │  ❌ Голосовые клипы — только Pro+    │
│              │            │  Не для нашей ЦА                    │
└──────────────┴────────────┴──────────────────────────────────────┘
```

**Вывод:** Telegram единственный правильный выбор для Israeli SMB.
Бесплатно + голос + самый популярный в Израиле.

---

## ЧАСТЬ 6 — ПОЛНЫЙ СПИСОК SKILLS

### По агентам (что устанавливаем)

```
מטה (Mateh — Orchestrator):
  └── brave-search, go-to-market, agent-team-orchestration

סייר (Sayer — Scout-Web):
  └── bright-data-web, browser

מאתר (Me'ater — Scout-SERP):
  └── bright-data-serp, programmatic-seo, meta-tags-optimizer

מאזין (Ma'azin — Scout-Social):
  └── xquik-x-twitter-scraper, brave-search, biz-reporter

מנתח (Menate'ach — Analyst):
  └── [нет внешних skills — только анализ файлов]

עט (Et — Writer):
  └── de-ai-ify, marketing-strategy-pmm, brw-newsletter-creation-curation

יוצר (Yotzer — Creative):
  └── image-gen, felo-slides

שליח (Shali'ach — Distribution):
  └── adaptlypost, ghost-cms, agenticmail

מגדלור (Migdalor — AEO Monitor):
  └── ai-discoverability-audit, meta-tags-optimizer, sovereign-seo-audit
```

### Команды установки (один блок)

```bash
# Основные
clawhub install go-to-market
clawhub install marketing-strategy-pmm
clawhub install agent-team-orchestration

# Разведка
clawhub install bright-data-web
clawhub install bright-data-serp
clawhub install programmatic-seo
clawhub install xquik-x-twitter-scraper
clawhub install biz-reporter

# Контент
clawhub install de-ai-ify
clawhub install brw-newsletter-creation-curation
clawhub install meta-tags-optimizer

# Creative
clawhub install image-gen
clawhub install felo-slides

# Distribution
clawhub install adaptlypost
clawhub install ghost-cms
clawhub install agenticmail

# AEO
clawhub install ai-discoverability-audit
clawhub install sovereign-seo-audit
```

---

## ЧАСТЬ 7 — МОДЕЛИ И РОУТИНГ

```
מטה Daily Brief          → claude-haiku-4-5        (~$0.001/запрос)
סייר/מאתר/מאזין Research → claude-sonnet-4-5       (~$0.01/запрос)
מנתח Deep Analysis       → claude-opus-4-6         (~$0.05/запрос, редко)
עט Writing               → claude-sonnet-4-5       (~$0.01/запрос)
יוצר Images              → image-gen API (Replicate) (~$0.002/изображение)
שליח Publishing          → claude-haiku-4-5        (просто копирует)
מגדלור AEO               → claude-sonnet-4-5       (1x/мес)
Fallback (0 кредитов)    → kimi-k2.5:cloud         (бесплатно)
```

**Бюджет в месяц (обновлённый прогноз):**

```
Daily Brief 5x/нед (Haiku):              ~$3-5
Weekly Full Report (Sonnet):             ~$10-15
Analyst deep dives (Opus, 1x/мес):      ~$5-8
Writing tasks (Sonnet):                  ~$8-12
Images (Replicate, ~20 изобр/мес):      ~$2-4
AEO Monitor (Sonnet, 1x/мес):           ~$2-3
Ad-hoc requests:                         ~$5-10
────────────────────────────────────────────────
Итого:                                   ~$35-57/мес
```

---

## ЧАСТЬ 8 — ПОРЯДОК РАЗРАБОТКИ ФАЙЛОВ

### Приоритет 🔴 (пишем первыми — всё зависит от них)

```
1. USER.md               — данные о нас, конкурентах, ключевых словах
2. BRAND.md (x3)         — голос FM, Kol, Gius (отдельно каждый)
3. SOUL.md мטה           — orchestrator, читает USER.md и BRAND.md
4. HEARTBEAT.md          — только Cron jobs, не Heartbeat polling
```

### Приоритет 🟡 (пишем вторыми)

```
5. AGENTS.md             — model routing + правила поведения
6. MEMORY.md             — шаблон (агент заполняет сам)
7. openclaw.json         — конфиг: агенты, биндинги, модели
```

### Приоритет 🟢 (пишем третьими — 9 agent SOUL.md)

```
8.  agents/sayer/SOUL.md
9.  agents/meater/SOUL.md
10. agents/maazin/SOUL.md
11. agents/menateach/SOUL.md
12. agents/et/SOUL.md
13. agents/yotzer/SOUL.md
14. agents/shaliach/SOUL.md
15. agents/migdalor/SOUL.md
16. docker-compose.searxng.yml
```

### Приоритет 🔵 (deployment wizard — фаза 2)

```
17. deployment-wizard/    — Telegram бот для нон-тех пользователей
    ├── bot.js
    ├── questions.json    — вопросы онбординга
    ├── templates/        — шаблоны файлов с плейсхолдерами
    └── deploy.js         — логика деплоя через Hostinger API
```

---

## ЧАСТЬ 9 — GITHUB РЕПОЗИТОРИЙ

```
flowmatic-openclaw-agents/
├── README.md                           ← обзор + быстрый старт
├── README.he.md                        ← ивритская версия
│
├── mateh-system/                       ← полная 9-агентная система
│   ├── workspace/
│   │   ├── SOUL.md                     ← מטה
│   │   ├── AGENTS.md
│   │   ├── HEARTBEAT.md
│   │   ├── USER.md.template
│   │   ├── MEMORY.md.template
│   │   └── brands/
│   │       ├── BRAND.md.template       ← универсальный шаблон
│   │       ├── flowmatic/BRAND.md      ← наш реальный (пример)
│   │       ├── kol/BRAND.md
│   │       └── gius/BRAND.md
│   ├── agents/
│   │   ├── sayer/SOUL.md
│   │   ├── meater/SOUL.md
│   │   ├── maazin/SOUL.md
│   │   ├── menateach/SOUL.md
│   │   ├── et/SOUL.md
│   │   ├── yotzer/SOUL.md
│   │   ├── shaliach/SOUL.md
│   │   └── migdalor/SOUL.md
│   ├── openclaw.json.example
│   ├── docker-compose.searxng.yml
│   └── SKILLS.md                       ← что устанавливать и зачем
│
├── deployment-wizard/                  ← 🆕 бот для нон-тех
│   ├── README.md
│   ├── bot.js
│   ├── questions.json
│   └── templates/
│
└── CHANGELOG.md
```

---

## ЧАСТЬ 10 — ПЛАН КОНТЕНТА

### Структура видео (обновлённая)

**[0:00–2:00] Business Overview**
Показываем реальный Telegram:
- Daily Brief с данными о конкурентах
- Черновик поста с изображением от יוצר
- Weekly GTM Report
- "Это работает пока вы спите. 20 минут в день на review."

**[2:00–15:00] Quick Win**
```
2:00  → "За 13 минут — первый Daily Brief"
3:00  → USER.md: заполняем прямо на камере
5:30  → BRAND.md: объясняем зачем, заполняем FM как пример
7:30  → SOUL.md מטה: разбираем каждый раздел
9:00  → HEARTBEAT.md: один Cron job
10:30 → Подключаем Brave Search
11:30 → Telegram: уже был в прошлом видео, быстро
12:30 → Запускаем. Смотрим первый бриф.
14:00 → "Это база. Дальше — полная система."
```

**[15:00–end] Full Expert System**
```
15:00 → Архитектура: имена агентов на иврите, почему так
17:00 → File-based handoffs: почему это лучше чем sessions_spawn
19:00 → סייר + Bright Data: что это, зачем, как настроить
23:00 → מאזין + Xpoz: слушаем Israeli Reddit/LinkedIn
27:00 → מנתח: scoring matrix, как принимает решения
31:00 → עט + de-ai-ify: почему humanization обязателен
35:00 → יוצר: генерируем изображение прямо на камере
39:00 → שליח + adaptlypost: один агент — все платформы
43:00 → מגדלור: как нас цитируют AI-системы
47:00 → Mission Control: дашборд всей системы
50:00 → Реальные метрики за 2 недели
53:00 → Deployment Wizard: показываем бота
55:00 → "Хотите такую систему — flowmatic.co.il/haas"
```

### Структура поста

```
/guides/gtm-agent            ← Quick Win (агент за вечер)
/guides/gtm-agent-full       ← Full Expert System
/guides/gtm-agent-system     ← System monitoring (обновляется)
/guides/deployment-wizard    ← Отдельный пост про бота
```

---

## ЧАСТЬ 11 — КРИТЕРИИ ГОТОВНОСТИ

### Перед съёмкой:
- [ ] Система работает ≥2 недели без вмешательства
- [ ] Скриншоты: Daily Brief, Weekly Report, пост от עט, изображение от יוצר
- [ ] Mission Control с 9 агентами на экране
- [ ] Метрика: "X часов сэкономлено за 2 недели" (реальная цифра)
- [ ] API стоимость известна точно (не прогноз)
- [ ] de-ai-ify протестирован: тексты не звучат как AI
- [ ] adaptlypost протестирован: пост опубликован хотя бы в 2 соцсетях
- [ ] Deployment Wizard (Фаза 1 — форма+ZIP) работает

### Перед публикацией на GitHub:
- [ ] USER.md.template — нет реальных credentials
- [ ] BRAND.md.template — плейсхолдеры, не наши реальные данные
- [ ] Наши реальные BRAND.md (FM/Kol/Gius) — публикуем как пример
- [ ] README.md на иврите + английском
- [ ] SKILLS.md с инструкциями по каждому skill
- [ ] CHANGELOG.md заполнен

---

## ЧАСТЬ 12 — СЛЕДУЮЩИЕ ШАГИ В ЧАТЕ

**Прямо сейчас (в этой сессии):**
1. Собираем USER.md через вопросы (я спрашиваю — ты отвечаешь)
2. Набрасываем BRAND.md для FM (основа)
3. Пишем SOUL.md мטה (главный файл)

**После чата — в терминале:**
1. Покупаем KVM 4 на Hostinger
2. Разворачиваем OpenClaw
3. Загружаем файлы
4. Запускаем

**Через 2 недели — снимаем.**

---

*Версия 2.0 | После полного исследования GitHub community OpenClaw, март 2026*
*Следующее обновление: после первых 2 недель работы системы*
