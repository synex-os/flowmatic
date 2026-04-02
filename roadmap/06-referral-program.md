# Step 6: Referral Program

> Приоритет: Неделя 3 · Усилие: 2 дня · Влияние: Growth
> Простая механика: приведи друга → оба выигрывают

## Механика

- **Реферер** (существующий клиент): +1 месяц бесплатно после активации реферала
- **Реферал** (новый клиент): 14 дней бесплатно без кредитки

## Реализация

### 1. DB schema

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID REFERENCES users(id),
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referee_email VARCHAR(255),
  referee_user_id UUID,
  status VARCHAR(50) DEFAULT 'pending', -- pending|trial_started|converted|expired
  trial_instance_id TEXT,               -- VPS created for trial
  created_at TIMESTAMPTZ DEFAULT now(),
  trial_started_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,             -- реферал оплатил первый месяц
  rewarded_at TIMESTAMPTZ               -- реферер получил бесплатный месяц
);
```

### 2. Генерация кода

```typescript
import { nanoid } from 'nanoid'

const code = 'CF-' + nanoid(6).toUpperCase()  // пример: CF-X4K9PL
const link = `https://clawflow.flowmatic.co.il/?ref=${code}`
```

### 3. Регистрация реферала

В `register.html` — читаем `?ref=` из URL:
```javascript
const refCode = new URLSearchParams(window.location.search).get('ref')
if (refCode) localStorage.setItem('cf_ref', refCode)
```

При checkout — передаём `refCode` в API. API:
1. Создаёт instance с `status: 'trial'`, `trial_ends_at: now + 14 days`
2. НЕ чарджит через AllPay (пропускаем payment step)
3. Provisioning запускается нормально — клиент получает VPS
4. Обновляет referral: `status: 'trial_started'`

### 4. Trial → Conversion

Cron job ежедневно:
```typescript
// Найти trials которые заканчиваются через 3 дня
const expiring = await db.select().from(instances)
  .where(and(
    eq(instances.status, 'trial'),
    lt(instances.trialEndsAt, addDays(new Date(), 3))
  ))

for (const inst of expiring) {
  // Telegram: "הניסיון שלך מסתיים בעוד 3 ימים. לחצו כאן לשדרוג →"
  await telegram.sendMessage(inst.telegramChatId, trialExpiryMsg)
}

// Найти expired trials
const expired = await db.select().from(instances)
  .where(and(
    eq(instances.status, 'trial'),
    lt(instances.trialEndsAt, new Date())
  ))

for (const inst of expired) {
  // Suspend VPS (не удалять — дать 7 дней grace period)
  await provisioner.suspend(inst.hetznerServerId)
  await db.update(instances).set({ status: 'trial_expired' }).where(eq(instances.id, inst.id))
  // Telegram: "הניסיון הסתיים. השרת הוקפא. שדרגו תוך 7 ימים או שהנתונים יימחקו."
}
```

### 5. Reward реферера

Когда реферал оплачивает первый месяц (AllPay webhook → `payment_success`):
```typescript
// В billing.ts → handleAllpayWebhook
const referral = await db.select().from(referrals)
  .where(eq(referrals.trialInstanceId, instanceId))

if (referral && referral.status === 'trial_started') {
  // Mark converted
  await db.update(referrals).set({
    status: 'converted',
    convertedAt: new Date()
  }).where(eq(referrals.id, referral.id))

  // Reward referrer: free_until += 30 days
  const referrer = await db.select().from(instances)
    .where(eq(instances.userId, referral.referrerUserId))

  if (referrer[0]) {
    const currentFreeUntil = referrer[0].freeUntil || new Date()
    const newFreeUntil = addDays(max(currentFreeUntil, new Date()), 30)
    await db.update(instances).set({ freeUntil: newFreeUntil })
      .where(eq(instances.id, referrer[0].id))

    // Telegram: "🎉 חבר שלך הצטרף! קיבלת חודש נוסף בחינם"
    await telegram.sendMessage(referrer[0].telegramChatId,
      '🎉 חבר שלך הצטרף ל-ClawFlow! קיבלת חודש נוסף בחינם.')
  }
}
```

### 6. AllPay billing skip logic

В monthly billing webhook — check `freeUntil`:
```typescript
if (instance.freeUntil && instance.freeUntil > new Date()) {
  // Skip this month's charge
  return ok(c, null, 'Free month — skipping charge')
}
```

### 7. Dashboard — вкладка "חברים"

В Settings или Home tab:

```
┌─────────────────────────────────────────────────┐
│ 🎁 הזמינו חברים                                 │
│                                                   │
│ הקישור שלכם:                                     │
│ ┌─────────────────────────────────────────┐       │
│ │ clawflow.flowmatic.co.il/?ref=CF-X4K9PL │ [📋] │
│ └─────────────────────────────────────────┘       │
│                                                   │
│ [QR Code]  ← שתפו עם חברים                      │
│                                                   │
│ הזמנתם: 3 חברים                                  │
│ חסכתם: ₪507 (3 חודשים בחינם)                    │
│                                                   │
│ ── היסטוריה ──                                    │
│ ✅ david@... — הצטרף 12/03 — קיבלתם חודש!       │
│ ✅ miri@... — הצטרפה 08/03 — קיבלתם חודש!       │
│ ⏳ yossi@... — בתקופת ניסיון (5 ימים)            │
└─────────────────────────────────────────────────┘
```

### 8. DB migration — instances table

```sql
ALTER TABLE instances ADD COLUMN free_until TIMESTAMPTZ;
ALTER TABLE instances ADD COLUMN trial_ends_at TIMESTAMPTZ;
ALTER TABLE instances ADD COLUMN status_detail VARCHAR(50); -- trial|trial_expired
```

## Антифрод

Не делаем ничего особенного — по твоему решению.
Единственное: trial instance = real VPS на Hetzner ≈ ₪30-40.
Если не конвертируется — теряем эту сумму. Ок.

## Файлы для создания/изменения

| Файл | Действие |
|------|----------|
| `apps/api/src/controllers/hosting/referrals.ts` | Создать — generate code, track, reward |
| `apps/api/src/routes/hosting.ts` | Добавить routes |
| `apps/api/src/db/schema.ts` | referrals table + instances columns |
| `apps/api/src/controllers/hosting/billing.ts` | Free month skip logic |
| `apps/web/public/register.html` | Read ?ref= param |
| `apps/web/public/checkout.html` | Skip payment for trial |
| `apps/web/public/dashboard.html` | Referral section |
| `apps/api/src/jobs/trial-expiry.ts` | Daily cron: expiry warnings |
| DB migration | CREATE TABLE + ALTER TABLE |

## Порядок реализации

1. DB migration
2. Referral code generation + API
3. Register/checkout flow для trial (skip payment)
4. Provisioning для trial instances
5. Trial expiry cron job
6. Reward logic in billing webhook
7. Dashboard UI (link, QR, history)
8. Тест: create referral → trial signup → convert → verify reward
