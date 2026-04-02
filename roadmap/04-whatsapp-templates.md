# Step 4: WhatsApp Business — шаблоны и рассылки

> Приоритет: Неделя 2 · Усилие: 4 дня · Влияние: Differentiation
> Все издержки на стороне клиента. Мы монетизируем только хостинг.

## Цель

MATEH שליח агент может отправлять WhatsApp маркетинговые сообщения
через одобренные Meta шаблоны (HSM). Каждый клиент подключает свой
WhatsApp Business account через Green API.

## Ключевой принцип

Клиент платит Green API напрямую. Клиент платит Meta за рассылки (~$0.05-0.08/msg).
ClawFlow берёт ₪0 за WhatsApp — только стоимость хостинга VPS.

## Flow для клиента

```
1. Клиент регистрируется в Green API (greenapi.com)
2. Привязывает свой WhatsApp Business номер
3. В Dashboard → Integrations → WhatsApp:
   - Вводит Instance ID + API Token от Green API
   - ClawFlow сохраняет на VPS
4. עט агент пишет текст шаблона
5. Approval Queue → клиент одобряет
6. API: создаём шаблон в Meta через Green API
7. Meta одобряет шаблон (24-48ч)
8. שליח агент рассылает через sendTemplate
```

## Meta Template Types

| Тип | Использование | Одобрение |
|-----|--------------|-----------|
| MARKETING | Акции, новинки, рассылки | 24-48ч |
| UTILITY | Подтверждения, напоминания | Быстрее |
| AUTHENTICATION | OTP | Не нужен нам |

## Opt-In — критично!

Meta БАНИТ Business Account без opt-in от получателей.

### Варианты opt-in (настраиваемые в Dashboard):

**Вариант A: Входящее сообщение**
Клиент добавляет на сайт/соцсети: "שלחו הודעה ל-05X-XXXXXXX ותקבלו עדכונים"
Когда человек пишет "הצטרף" → сохраняем `opted_in: true`.

**Вариант B: Checkbox на сайте клиента**
JavaScript snippet для сайта клиента:
```html
<script src="https://api.clawflow.flowmatic.co.il/wa/optin-widget.js"
        data-instance="INSTANCE_ID"></script>
```
Рендерит checkbox с текстом: "מסכים/ה לקבל עדכונים בוואטסאפ"

**Вариант C: Manual CSV upload**
Клиент загружает CSV с номерами + подтверждает что получил opt-in.
Мы сохраняем но предупреждаем о рисках.

### Dashboard Settings — секция WhatsApp:
- Radio: какой opt-in метод
- Для варианта A: автоответ на входящее (настраиваемый текст)
- Для варианта B: snippet для копирования
- Для варианта C: upload area + checkbox אישור

## Реализация

### 1. DB schema

```sql
CREATE TABLE wa_config (
  instance_id TEXT PRIMARY KEY REFERENCES instances(id),
  green_api_instance VARCHAR(255),
  green_api_token VARCHAR(255),
  business_phone VARCHAR(20),
  optin_method VARCHAR(20) DEFAULT 'incoming', -- incoming|website|manual
  auto_reply_text TEXT DEFAULT 'ברוכים הבאים! תקבלו עדכונים מאיתנו 🎉',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE wa_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id TEXT REFERENCES instances(id),
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(255),
  opted_in BOOLEAN DEFAULT false,
  opted_in_at TIMESTAMPTZ,
  opted_in_method VARCHAR(20), -- incoming|website|manual
  opted_out BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(instance_id, phone)
);

CREATE TABLE wa_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id TEXT REFERENCES instances(id),
  template_name VARCHAR(512),    -- snake_case, латиница only
  category VARCHAR(50),          -- MARKETING|UTILITY
  language VARCHAR(10) DEFAULT 'he',
  body_text TEXT,
  variables JSONB,               -- ["{{1}}", "{{2}}"]
  meta_template_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft', -- draft|submitted|approved|rejected
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE wa_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id TEXT REFERENCES instances(id),
  template_id UUID REFERENCES wa_templates(id),
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'queued', -- queued|sending|completed|failed
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. Green API integration service

```typescript
// apps/api/src/services/greenapi.ts

class GreenAPIService {
  constructor(private instanceId: string, private apiToken: string) {}

  async createTemplate(params: {
    name: string
    category: 'MARKETING' | 'UTILITY'
    language: string
    bodyText: string
    variables?: string[]
  }): Promise<{ templateId: string }>

  async getTemplateStatus(templateName: string): Promise<'PENDING' | 'APPROVED' | 'REJECTED'>

  async sendTemplate(params: {
    phone: string
    templateName: string
    variables?: string[]
  }): Promise<{ messageId: string }>

  async sendBulkTemplate(params: {
    phones: string[]
    templateName: string
    variables?: string[]
  }): Promise<{ sent: number; failed: number }>
}
```

### 3. שליח agent integration

MATEH שליח SOUL.md addition:
```markdown
## WhatsApp
- Draft template → Approval Queue (type: wa_template)
- After user approves → submit to Meta for approval
- Poll status every 2 hours until approved
- Schedule send: check wa_contacts with opted_in = true
- NEVER send to contacts without opt-in
- Hebrew RTL: supported natively in templates
```

### 4. Dashboard — WhatsApp section in Integrations

```
┌─────────────────────────────────────────────────┐
│ 📱 WhatsApp Business                             │
│                                                   │
│ Instance ID:  [________________]                  │
│ API Token:    [________________]                  │
│ [שמרו]  [הוראות הרשמה ב-Green API →]            │
│                                                   │
│ ── Opt-In Settings ──                             │
│ ○ הודעה נכנסת (incoming message)                  │
│ ● אתר הלקוח (website checkbox)                   │
│ ○ העלאת CSV ידנית                                │
│                                                   │
│ ── Contacts ──                                    │
│ 🟢 142 opted-in  |  3 opted-out  |  [ייבוא CSV]  │
│                                                   │
│ ── Templates ──                                   │
│ ✅ welcome_message — APPROVED                     │
│ ⏳ weekly_promo — PENDING (submitted 2ч ago)      │
│ [+ יצירת תבנית חדשה]                             │
│                                                   │
│ ── Recent Sends ──                                │
│ 12/03 weekly_promo → 134/142 delivered (94%)      │
└─────────────────────────────────────────────────┘
```

## Hebrew RTL в шаблонах

Green API и Meta поддерживают RTL нативно. Переменные `{{1}}`, `{{2}}`
работают с ивритом. Тестировать на Android и iOS.

## Файлы для создания/изменения

| Файл | Действие |
|------|----------|
| `apps/api/src/services/greenapi.ts` | Создать |
| `apps/api/src/controllers/hosting/whatsapp.ts` | Создать — config, contacts, templates, sends |
| `apps/api/src/routes/hosting.ts` | Добавить routes |
| `apps/api/src/db/schema.ts` | 4 новые таблицы |
| `apps/web/public/dashboard.html` | WhatsApp секция в Integrations |
| `templates/mateh-system/agents/shaliach/SOUL.md` | WhatsApp instructions |
| DB migration | CREATE TABLE × 4 |

## Порядок реализации

1. DB migration
2. Green API service
3. API controllers (config, contacts CRUD, templates CRUD, send)
4. Dashboard UI (config, contacts, templates, send history)
5. שליח SOUL.md update
6. Opt-in widget JS (для варианта B)
7. Тест: create template → submit → (wait for approval) → send to test number
