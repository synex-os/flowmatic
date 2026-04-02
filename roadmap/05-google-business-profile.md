# Step 5: Google Business Profile — автопостинг и мониторинг отзывов

> Приоритет: Неделя 2-3 · Усилие: 3 дня · Влияние: Local SEO
> Мощный канал для ресторанов, бутиков, клиник, салонов

## Цель

MATEH может публиковать Google Posts и отвечать на отзывы
через Google Business Profile API. Всё через Approval Queue.

## OAuth — через существующий Google flow

Добавить scope `business.manage` в existing Google OAuth:

Файл: `apps/api/src/controllers/hosting/google.ts`

```typescript
const SCOPE_MAP = {
  // ... existing scopes ...
  gbp: 'https://www.googleapis.com/auth/business.manage',
}
```

В Dashboard → Integrations → Google → добавить checkbox "Google Business Profile".

Клиент ставит галочку → переподключает Google → scope добавляется.

## Автопостинг (Google Posts API)

### Что публикуем

| Тип поста | Длительность | Use case |
|-----------|-------------|----------|
| STANDARD | 7 дней | Обычные обновления |
| EVENT | До даты события | Мероприятия, акции |
| OFFER | До даты | Скидки, промо |

### Flow

```
1. עט агент пишет Hebrew текст (до 1500 символов)
2. יוצר агент генерирует изображение (если нужно)
3. Approval Queue → клиент одобряет
4. שליח публикует через GBP API
5. Cron: שליח автоматически перепубликует STANDARD каждые 6 дней
```

### API вызов

```typescript
// POST /v4/accounts/{accountId}/locations/{locationId}/localPosts
const post = {
  languageCode: 'he',
  summary: approvedText,  // до 1500 символов
  callToAction: {
    actionType: 'CALL',   // или LEARN_MORE, BOOK, ORDER, SHOP
    url: businessUrl
  },
  media: imageUrl ? [{
    mediaFormat: 'PHOTO',
    sourceUrl: imageUrl
  }] : undefined,
  topicType: 'STANDARD'   // STANDARD | EVENT | OFFER
}
```

## Мониторинг отзывов

### Cron job

מגדלור агент проверяет новые отзывы еженедельно (или ежедневно для активных бизнесов).

```typescript
// GET /v4/accounts/{id}/locations/{id}/reviews?orderBy=updateTime desc&pageSize=10
const reviews = await gbpApi.getReviews(accountId, locationId)
const newNegative = reviews.filter(r =>
  r.starRating <= 3 && !r.reviewReply && isNew(r.updateTime, 7)  // за последние 7 дней
)

for (const review of newNegative) {
  // עט генерирует ответ → Approval Queue
  const draft = await generateReviewReply(review, businessProfile)
  await outputs.create({
    instanceId,
    type: 'review_reply',
    platform: 'google',
    title: `תגובה לביקורת ${review.starRating}⭐`,
    content: draft,
    metadata: { reviewId: review.name, starRating: review.starRating }
  })
}
```

### Ответ на отзыв после одобрения

```typescript
// При publish output с type=review_reply:
// PUT /v4/{reviewName}/reply
await gbpApi.replyToReview(review.name, { comment: approvedText })
```

**Важно:** отвечать в течение 48ч — влияет на Local SEO ranking.
Клиент получает Telegram уведомление о новом негативном отзыве.

## DB schema

```sql
CREATE TABLE gbp_config (
  instance_id TEXT PRIMARY KEY REFERENCES instances(id),
  account_id VARCHAR(255),
  location_id VARCHAR(255),
  auto_repost BOOLEAN DEFAULT true,  -- перепубликация каждые 6 дней
  review_check_frequency VARCHAR(20) DEFAULT 'weekly', -- daily|weekly
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Dashboard — GBP секция

В Integrations tab, внутри Google Workspace section:

```
┌─────────────────────────────────────────────────┐
│ 📍 Google Business Profile                       │
│ Status: ✅ Connected                              │
│ Business: [Café Tel Aviv]                        │
│                                                   │
│ Auto-repost: [✅ כל 6 ימים]                      │
│ Review alerts: [○ יומי  ● שבועי]                 │
│                                                   │
│ Last post: 2 days ago                             │
│ New reviews: 3 (1 negative — pending reply)       │
└─────────────────────────────────────────────────┘
```

## Файлы для создания/изменения

| Файл | Действие |
|------|----------|
| `apps/api/src/controllers/hosting/google.ts` | Добавить GBP scope + API calls |
| `apps/api/src/controllers/hosting/outputs.ts` | Добавить review_reply publish handler |
| `apps/api/src/routes/hosting.ts` | GBP routes |
| `apps/api/src/db/schema.ts` | gbp_config table |
| `apps/web/public/dashboard.html` | GBP section в Integrations |
| `templates/mateh-system/agents/shaliach/SOUL.md` | GBP posting instructions |
| `templates/mateh-system/agents/migdalor/SOUL.md` | Review monitoring |

## Порядок реализации

1. Добавить GBP scope в Google OAuth
2. DB migration — gbp_config
3. GBP API client (posts + reviews)
4. שליח: publish + auto-repost cron
5. מגדלור: review monitoring cron
6. Dashboard UI
7. Тест: подключить тестовый GBP → пост → отзыв → ответ
