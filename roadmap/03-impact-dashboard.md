# Step 3: Activity Log + Impact Dashboard

> **СТАТУС: ОТЛОЖЕН — требует более детальной проработки**
> Приоритет: Неделя 1-2 · Усилие: 5 дней · Влияние: Retention
> Клиент видит ценность MATEH в шекелях — главный аргумент против отписки
>
> Решение Сергея: "Пока не делаем. Это сложно и нужно продумывать
> более конкретно и детально."
> TODO: проработать источники данных, ROI формулу, MVP scope

## Цель

Показать клиенту КОНКРЕТНУЮ ценность: сколько часов сэкономлено,
сколько людей увидели контент, каков ROI подписки.

Weekly report каждое воскресенье в Telegram + панель в Dashboard.

## Откуда берём данные

### Источник 1: Наша DB (уже есть)
- `outputs` таблица — все published outputs с типом, платформой, датой
- `instances` — план, цена, дата создания

### Источник 2: Meta Insights API (нужно добавить scope)
Текущий Meta OAuth уже подключён. Нужно добавить scope:
```
pages_read_engagement
instagram_basic
instagram_manage_insights
```
Это даст: reach, impressions, likes, comments, shares для каждого поста.

**Как:** В `apps/api/src/controllers/hosting/meta.ts` → добавить scopes при OAuth.
После публикации поста — cron через 24ч запрашивает insights и сохраняет в `mateh_activity_log`.

### Источник 3: Google Ads API (уже подключён)
Impressions, clicks, conversions, cost — из existing Google OAuth.

### Источник 4: Resend/Newsletter (если подключён)
Opens, clicks — из Resend webhooks.

### Источник 5: Usage tracking (из LLM Router, файл 2)
Model usage, token count, estimated AI cost.

## Схема данных

```sql
-- Лог каждого действия агента
CREATE TABLE mateh_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id TEXT REFERENCES instances(id),
  agent_name VARCHAR(50),       -- sayer|meater|maazin|menateach|et|yotzer|shaliach|migdalor|personal
  action_type VARCHAR(100),     -- post_published|email_sent|competitor_tracked|review_replied|wa_sent
  platform VARCHAR(50),         -- instagram|facebook|google_ads|whatsapp|email|wordpress|telegram
  metadata JSONB,               -- {reach, likes, shares, clicks, cost_usd, competitor_name}
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Агрегированный недельный отчёт
CREATE TABLE weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id TEXT REFERENCES instances(id),
  week_start DATE,
  posts_published INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  total_reach INTEGER DEFAULT 0,
  total_engagement INTEGER DEFAULT 0,
  avg_engagement_pct NUMERIC(5,2) DEFAULT 0,
  competitors_tracked INTEGER DEFAULT 0,
  keywords_in_top INTEGER DEFAULT 0,
  ai_cost_usd NUMERIC(10,4) DEFAULT 0,
  estimated_value_ils NUMERIC(10,2) DEFAULT 0,
  roi_multiplier NUMERIC(5,2) DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Расчёт ROI (estimated value)

```typescript
function calculateWeeklyValue(data: WeeklyData, planPrice: number): ROI {
  // Время сэкономлено
  const hoursFromPosts = data.posts_published * 0.5   // 30 мин на пост
  const hoursFromEmails = data.emails_sent * 0.3       // 18 мин на email
  const hoursFromCompetitors = data.competitors_tracked * 1.0  // 1 час на отчёт
  const hoursFromReviews = data.reviews_replied * 0.25  // 15 мин на ответ
  const totalHours = hoursFromPosts + hoursFromEmails + hoursFromCompetitors + hoursFromReviews

  // Ценность в шекелях
  const timeValue = totalHours * 150   // ₪150/час — средний фрилансер в Израиле
  const reachValue = data.total_reach * 0.03   // ₪0.03 CPM эквивалент
  const reportValue = data.competitors_tracked * 200  // ₪200 за отчёт агентства

  const totalValue = timeValue + reachValue + reportValue
  const roi = planPrice > 0 ? totalValue / planPrice : 0

  return { totalHours, totalValue, roi, breakdown: { timeValue, reachValue, reportValue } }
}
```

## Weekly Telegram Report

Cron job на management server: каждое воскресенье 08:00 Jerusalem.

```typescript
// apps/api/src/jobs/weekly-report.ts

async function sendWeeklyBrief(instanceId: string) {
  const report = await aggregateWeek(instanceId)
  const [instance] = await db.select().from(instances).where(eq(instances.id, instanceId))

  const msg = `
📊 *סיכום שבועי — MATEH*

💰 ערך שנוצר: ₪${report.estimated_value.toLocaleString('he-IL')}
📈 ROI: ${report.roi.toFixed(1)}x על המנוי שלך
⏱ שעות שנחסכו: ${report.totalHours.toFixed(1)}
📣 חשיפה: ${report.total_reach.toLocaleString('he-IL')} איש
✅ פורסם: ${report.posts_published} פוסטים
📧 מיילים: ${report.emails_sent}
👁 מתחרים: ${report.competitors_tracked} נבדקו
💸 עלות AI: $${report.ai_cost_usd.toFixed(2)}

[פתחו את הדשבורד](https://clawflow.flowmatic.co.il/dashboard)
  `.trim()

  if (instance?.telegramChatId) {
    await telegram.sendMessage(instance.telegramChatId, msg, { parse_mode: 'Markdown' })
  }

  // Save report
  await db.insert(weeklyReports).values({
    instanceId,
    weekStart: getWeekStart(),
    ...report,
    sentAt: new Date(),
  })
}
```

## Dashboard панель

В Home tab — новая секция "ביצועים השבוע":

```
┌─────────────────────────────────────────────────┐
│ 📊 ביצועים השבוע                                │
│                                                  │
│  ₪2,400         5.3x          8.5              │
│  ערך שנוצר      ROI           שעות שנחסכו      │
│                                                  │
│  ┌──────┬──────┬──────┬──────┐                  │
│  │ 12   │ 4    │ 3    │ 850  │                  │
│  │פוסטים│מיילים│מתחרים│ חשיפה│                  │
│  └──────┴──────┴──────┴──────┘                  │
│                                                  │
│  💸 עלות AI החודש: $4.20                        │
│  [היסטוריה שבועית →]                            │
└─────────────────────────────────────────────────┘
```

## Файлы для создания/изменения

| Файл | Действие |
|------|----------|
| `apps/api/src/db/schema.ts` | Добавить mateh_activity_log + weekly_reports |
| `apps/api/src/jobs/weekly-report.ts` | Создать cron job |
| `apps/api/src/controllers/hosting/activity.ts` | Создать — log + aggregate |
| `apps/api/src/controllers/hosting/meta.ts` | Добавить insights scopes + fetch |
| `apps/api/src/routes/hosting.ts` | Добавить routes |
| `apps/web/public/dashboard.html` | Impact panel в Home tab |
| DB migration | CREATE TABLE × 2 |

## Порядок реализации

1. DB migration — создать таблицы
2. Activity logging — при каждом publish output записывать в activity_log
3. Meta Insights — добавить scope, fetch через 24ч после publish
4. Aggregation function — подсчёт ROI
5. Weekly cron job — Telegram report
6. Dashboard UI — impact panel
7. Тест: publish 3 outputs, verify aggregation + report
