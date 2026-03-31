# CLAUDE.md — OpenClaw Hosting Platform
## Master Build Plan for Development Agent

> **Для агента разработки:** Ты ведёшь Сергея шаг за шагом через всю разработку.
> На каждом шаге: объясняй что делаешь и зачем, задавай вопросы если нужны данные,
> проси зарегистрироваться в сервисах когда это нужно, жди подтверждения перед тем
> как двигаться дальше. Никогда не пропускай шаги молча.

---

## Продукт

**Название:** OpenClaw Hosting by Flowmatic
**URL:** openclaw.flowmatic.co.il
**Суть:** Hosting-as-a-Service для OpenClaw AI агентов. Пользователь выбирает агентов
через конфигуратор → оплачивает через AllPay → получает готовый VPS с OpenClaw +
n8n/Activepieces через 3-4 минуты. Никакого self-hosting, никаких команд в терминале.

**Рынок:** Израиль. Иврит по умолчанию, переключение на английский.
**База:** Fork https://github.com/bfzli/clawhost (MIT)
**Инфраструктура:** Hetzner Cloud (Европа) → VPS для каждого клиента
**Биллинг:** AllPay (рекуррент, рассрочки, хашбонит мас автоматически)

---

## Агенты в системе (v1.0)

### 1. OpenClaw Personal
- Личный ассистент в Telegram: расписание, напоминания, поиск, черновики
- RAM: 1GB | VPS: Hetzner CX22

### 2. MATEH — Marketing Agent
- 9 маркетинговых агентов: daily brief, мониторинг конкурентов, контент
- Research Engine: реальный web_search перед запуском (research-engine.js уже написан)
- RAM: 3GB | VPS: Hetzner CX32 минимум
- Telegram-бот: альтернативный вход для онбординга

### Будущие агенты (заглушки в UI, badge "בקרוב")
- נציג מכירות ותמיכה (Sales & Support Agent)
- eCommerce Agent

---

## Планы VPS (автоматически рассчитываются конфигуратором)

| Plan | Hebrew | RAM | CPU | NVMe | Hetzner type | Price ₪/мес |
|------|--------|-----|-----|------|--------------|-------------|
| Personal | אישי | 4GB | 2 shared | 40GB | cx22 | 79 |
| Business | עסקי | 8GB | 4 shared | 80GB | cx32 | 169 |
| Pro | פרו | 16GB | 4 dedicated EPYC | 160GB | ccx23 | 349 |
| Developer | מפתח | 32GB | 8 dedicated EPYC | 240GB | ccx33 | 599 |

**Логика:** план выбирается автоматически по суммарному RAM выбранных компонентов.
Пользователь не выбирает план вручную — конфигуратор считает сам.

---

## Добавки (Add-ons)

| ID | Hebrew | Price ₪/мес | RAM |
|----|--------|-------------|-----|
| backup | גיבוי יומי | 19 | 0 |
| storage_20 | אחסון +20GB | 15 | 0 |
| storage_100 | אחסון +100GB | 49 | 0 |
| storage_500 | אחסון +500GB | 149 | 0 |

**AI Provider:** только "מפתח API שלי" (Anthropic/OpenAI ключ клиента) или Ollama (+8GB RAM).
AI Credits убраны — клиент всегда использует свой ключ.

---

## Файловая структура проекта

```
openclaw-hosting/
├── CLAUDE.md                          # этот файл
├── .env.example                       # все переменные окружения
├── .env                               # локальный (не в git)
├── .gitignore
├── turbo.json                         # Turborepo
├── pnpm-workspace.yaml
├── package.json
│
├── apps/
│   ├── web/                           # React + Vite frontend
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── pages/
│   │   │   │   ├── Landing.tsx        # Главная + конфигуратор
│   │   │   │   ├── Register.tsx       # Email + OTP
│   │   │   │   ├── Onboarding.tsx     # Wizard по шагам
│   │   │   │   ├── Dashboard.tsx      # ЛК — список агентов
│   │   │   │   ├── AgentDetail.tsx    # Детали одного агента
│   │   │   │   ├── Billing.tsx        # Биллинг и подписки
│   │   │   │   └── Admin.tsx          # Внутренняя панель (Сергей)
│   │   │   ├── components/
│   │   │   │   ├── Configurator.tsx   # Конфигуратор (код ниже)
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── AgentCard.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   ├── ResourceBar.tsx    # CPU/RAM индикатор
│   │   │   │   ├── Terminal.tsx       # xterm.js SSH (Developer план)
│   │   │   │   └── PopupDetail.tsx    # Попап деталей компонента
│   │   │   ├── hooks/
│   │   │   │   ├── useInstance.ts
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useBilling.ts
│   │   │   ├── i18n/
│   │   │   │   ├── index.ts
│   │   │   │   ├── he.ts              # Иврит (основной)
│   │   │   │   └── en.ts              # Английский
│   │   │   └── lib/
│   │   │       ├── api.ts             # API client
│   │   │       └── utils.ts
│   │   └── public/
│   │       └── favicon.svg
│   │
│   └── api/                           # Hono.js backend
│       ├── src/
│       │   ├── index.ts               # Entry point
│       │   ├── db/
│       │   │   ├── schema.ts          # Drizzle schema
│       │   │   ├── index.ts           # DB connection
│       │   │   └── migrations/
│       │   ├── routes/
│       │   │   ├── auth.ts            # OTP login
│       │   │   ├── instances.ts       # CRUD агентов
│       │   │   ├── billing.ts         # AllPay checkout + webhook
│       │   │   ├── onboarding.ts      # Wizard state
│       │   │   ├── admin.ts           # Admin panel API
│       │   │   └── health.ts          # Health check
│       │   ├── services/
│       │   │   ├── hetzner.ts         # Hetzner Cloud API
│       │   │   ├── cloudflare.ts      # DNS management
│       │   │   ├── allpay.ts          # AllPay integration
│       │   │   ├── provisioner.ts     # Orchestrator
│       │   │   ├── cloud-init.ts      # Template renderer
│       │   │   ├── telegram.ts        # Telegram Bot notifications
│       │   │   ├── research.ts        # Research Engine (из research-engine.js)
│       │   │   └── ssh.ts             # SSH tunnel для Developer
│       │   └── middleware/
│       │       ├── auth.ts
│       │       └── cors.ts
│       └── package.json
│
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── types.ts               # Общие TypeScript типы
│       │   └── constants.ts           # Планы, цены, конфиги
│       └── package.json
│
├── scripts/
│   ├── cloud-init-template.yaml       # Единый шаблон (Mustache)
│   └── cloud-init-dev-extra.sh        # Для Developer плана
│
└── infra/
    ├── docker-compose.yml             # Управляющий сервер
    └── Caddyfile                      # Reverse proxy + auto SSL
```

---

## Дизайн-система

### Шрифты (КРИТИЧНО для иврита)
```css
* { font-family: Arial, 'Arial Hebrew', Helvetica, sans-serif !important; }
```
**Никогда:** Google Fonts, Rubik, Inter, var(--font-sans) для иврита.

### RTL
```html
<html dir="rtl" lang="he">
```
При переключении на EN: `document.documentElement.setAttribute('dir', 'ltr')`

### Цвета
```css
--primary: #2563EB;
--primary-dark: #1D4ED8;
--bg-dark: #0F172A;
--bg-card: #1E3A5F;
--text-muted: #94A3B8;
--success: #10B981;
--warning: #F59E0B;
--danger: #EF4444;
--border: #E2E8F0;
--surface: #F1F5F9;
```

### Компонент конфигуратора
**ВАЖНО:** Конфигуратор уже полностью разработан в предыдущей сессии.
Код находится в секции `## ГОТОВЫЙ КОД КОНФИГУРАТОРА` в конце этого файла.
Скопировать verbatim в `apps/web/src/components/Configurator.tsx` с адаптацией под React.

---

## ENV переменные

```env
# === HETZNER ===
HETZNER_API_TOKEN=                  # cloud.hetzner.com → API Tokens → Create Token (Read+Write)
HETZNER_DATACENTER=hel1             # Helsinki — ближайший к IL с хорошим пингом
HETZNER_SSH_KEY_NAME=openclaw-master

# === CLOUDFLARE ===
CLOUDFLARE_API_TOKEN=               # dash.cloudflare.com → My Profile → API Tokens
CLOUDFLARE_ZONE_ID=                 # dash.cloudflare.com → Domain → Overview → Zone ID
CLOUDFLARE_DOMAIN=flowmatic.co.il
# Поддомены: agent.{id}.openclaw.flowmatic.co.il
#            flows.{id}.openclaw.flowmatic.co.il

# === ALLPAY ===
ALLPAY_LOGIN=                       # allpay.co.il → Settings → API Integrations
ALLPAY_API_KEY=                     # allpay.co.il → Settings → API Integrations
ALLPAY_WEBHOOK_SECRET=              # Генерируем сами: openssl rand -hex 32
ALLPAY_TEST_MODE=true               # Переключить на false перед запуском

# === ANTHROPIC (для Research Engine) ===
ANTHROPIC_API_KEY=                  # console.anthropic.com → API Keys

# === TELEGRAM ===
TELEGRAM_BOT_TOKEN=                 # @BotFather → /newbot
TELEGRAM_SUPPORT_CHAT_ID=          # ID чата для алертов Сергею

# === DATABASE ===
DATABASE_URL=postgresql://openclaw:password@localhost:5432/openclaw

# === AUTH ===
JWT_SECRET=                         # openssl rand -hex 64
OTP_SECRET=                         # openssl rand -hex 32

# === APP ===
API_URL=https://api.openclaw.flowmatic.co.il
FRONTEND_URL=https://openclaw.flowmatic.co.il
MASTER_SSH_KEY_PATH=/home/ubuntu/.ssh/openclaw_master

# === ADMIN ===
ADMIN_EMAIL=sergei@flowmatic.co.il  # Только этот email видит /admin
```

---

## Database Schema (Drizzle ORM + PostgreSQL)

```typescript
// packages/shared/src/schema.ts

import { pgTable, uuid, text, integer, decimal, 
         timestamp, boolean, inet, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id:         uuid('id').primaryKey().defaultRandom(),
  email:      text('email').unique().notNull(),
  name:       text('name'),
  phone:      text('phone'),
  language:   text('language').default('he'),   // 'he' | 'en'
  isAdmin:    boolean('is_admin').default(false),
  createdAt:  timestamp('created_at').defaultNow(),
});

export const instances = pgTable('instances', {
  id:                   text('id').primaryKey(),  // nanoid(10): 'abc123xyz0'
  userId:               uuid('user_id').references(() => users.id),
  
  // Config (from configurator)
  selectedComponents:   jsonb('selected_components'),  // ['oc','n8','ok','bk']
  automationTool:       text('automation_tool'),        // 'n8n' | 'activepieces'
  aiProvider:           text('ai_provider'),            // 'apikey' | 'ollama'
  storageGb:            integer('storage_gb').default(0),
  
  // Plan (auto-calculated)
  planKey:              text('plan_key').notNull(),    // 'personal'|'business'|'pro'|'developer'
  priceIls:             decimal('price_ils', {precision:10, scale:2}),
  
  // Infrastructure
  status:               text('status').notNull(),
  // provisioning → initializing → running → suspended → terminated
  hetznerServerId:      integer('hetzner_server_id'),
  ip:                   inet('ip'),
  subdomainAgent:       text('subdomain_agent'),       // agent.xxx.openclaw.flowmatic.co.il
  subdomainFlows:       text('subdomain_flows'),       // flows.xxx.openclaw.flowmatic.co.il
  
  // Credentials (encrypted at rest)
  openclawToken:        text('openclaw_token'),
  automationPassword:   text('automation_password'),
  sshPassword:          text('ssh_password'),          // только Developer
  
  // Billing
  allpaySubscriptionId: text('allpay_subscription_id'),
  nextBillingAt:        timestamp('next_billing_at'),
  
  // Onboarding
  onboardingStep:       integer('onboarding_step').default(0),
  onboardingCompleted:  boolean('onboarding_completed').default(false),
  
  // Research (for MATEH)
  researchData:         jsonb('research_data'),         // output of research-engine
  
  createdAt:            timestamp('created_at').defaultNow(),
  suspendedAt:          timestamp('suspended_at'),
});

export const payments = pgTable('payments', {
  id:              uuid('id').primaryKey().defaultRandom(),
  instanceId:      text('instance_id').references(() => instances.id),
  allpayOrderId:   text('allpay_order_id'),
  amountIls:       decimal('amount_ils', {precision:10, scale:2}),
  status:          text('status'),   // 'pending'|'paid'|'failed'|'refunded'
  paidAt:          timestamp('paid_at'),
  createdAt:       timestamp('created_at').defaultNow(),
});

export const addons = pgTable('addons', {
  id:                   uuid('id').primaryKey().defaultRandom(),
  instanceId:           text('instance_id').references(() => instances.id),
  addonType:            text('addon_type'),   // 'backup'|'storage'
  storageGb:            integer('storage_gb'),
  priceIls:             decimal('price_ils', {precision:10, scale:2}),
  allpaySubscriptionId: text('allpay_subscription_id'),
  status:               text('status'),
  createdAt:            timestamp('created_at').defaultNow(),
});

export const otpCodes = pgTable('otp_codes', {
  id:        uuid('id').primaryKey().defaultRandom(),
  email:     text('email').notNull(),
  code:      text('code').notNull(),           // 6 цифр
  expiresAt: timestamp('expires_at').notNull(),
  used:      boolean('used').default(false),
});
```

---

## API Routes

### Auth
```
POST /auth/otp/send       { email } → отправляет 6-значный код
POST /auth/otp/verify     { email, code } → возвращает JWT
GET  /auth/me             → текущий пользователь
```

### Instances
```
GET  /instances           → список инстансов текущего юзера
POST /instances/configure → { components, automationTool, storageGb }
                           → { planKey, priceTotal, breakdown }
                           → предварительный расчёт (без создания)
GET  /instances/:id       → детали инстанса
GET  /instances/:id/status → { status, uptime, cpu, ram }
POST /instances/:id/restart → перезапустить
DELETE /instances/:id     → terminate (с подтверждением)
```

### Billing
```
POST /billing/checkout    { instanceId, planKey, components, 
                            customerEmail, customerName, customerPhone }
                         → { paymentUrl } — редирект на AllPay
POST /billing/webhook     (AllPay webhook — без auth, HMAC проверка)
GET  /billing/subscriptions → активные подписки
POST /billing/cancel/:id  → отменить подписку
```

### Onboarding
```
GET  /onboarding/:instanceId      → текущий шаг и состояние
POST /onboarding/:instanceId/step → { step, data } → следующий шаг
POST /onboarding/:instanceId/connect-telegram → запустить TG pairing
POST /onboarding/:instanceId/connect-channel  → { channel, credentials }
POST /onboarding/:instanceId/run-research     → запустить Research Engine (MATEH)
```

### Admin (только ADMIN_EMAIL)
```
GET  /admin/instances     → все инстансы + статусы
GET  /admin/revenue       → MRR, payments history
GET  /admin/health        → статус всех VPS
POST /admin/instances/:id/suspend
POST /admin/instances/:id/terminate
```

---

## Hetzner Service

```typescript
// apps/api/src/services/hetzner.ts

const PLAN_TO_SERVER_TYPE: Record<string, string> = {
  personal:  'cx22',   // 2 vCPU shared,    4GB,  €4.35/мес
  business:  'cx32',   // 4 vCPU shared,    8GB,  €8.49/мес
  pro:       'ccx23',  // 4 vCPU dedicated, 16GB, €16.50/мес
  developer: 'ccx33',  // 8 vCPU dedicated, 32GB, €28.50/мес
};

// RAM requirements per component (для автоматического выбора плана)
export const COMPONENT_RAM: Record<string, number> = {
  base:    0.5,  // nginx + system
  oc:      1.0,  // OpenClaw Personal
  mt:      3.0,  // MATEH Marketing Agent
  sv:      2.0,  // Sales & Support (soon)
  ec:      2.0,  // eCommerce (soon)
  n8:      0.5,  // n8n
  ap:      0.5,  // Activepieces
  ol:      8.0,  // Ollama local model
  // ok, bk, xs: 0 RAM overhead
};

export function calcPlan(components: string[]): {
  planKey: string; ramNeeded: number; priceIls: number
} {
  const ramNeeded = components.reduce(
    (sum, c) => sum + (COMPONENT_RAM[c] || 0), 
    COMPONENT_RAM.base
  );
  const PLANS = [
    { key: 'personal',  ram: 4,  price: 79  },
    { key: 'business',  ram: 8,  price: 169 },
    { key: 'pro',       ram: 16, price: 349 },
    { key: 'developer', ram: 32, price: 599 },
  ];
  const plan = PLANS.find(p => p.ram >= ramNeeded) || PLANS[3];
  return { planKey: plan.key, ramNeeded, priceIls: plan.price };
}

export class HetznerService {
  async createVPS(params: {
    instanceId: string;
    planKey: string;
    cloudInitScript: string;
  }): Promise<{ serverId: number; ipv4: string }>;

  async deleteVPS(serverId: number): Promise<void>;
  async powerOff(serverId: number): Promise<void>;
  async powerOn(serverId: number): Promise<void>;
  async getStatus(serverId: number): Promise<'running'|'off'|'initializing'|'starting'>;
  async getMetrics(serverId: number): Promise<{ cpu: number; ram: number; disk: number }>;
}
```

---

## AllPay Service

```typescript
// apps/api/src/services/allpay.ts
// Документация: https://www.allpay.co.il/en/api-reference

export class AllPayService {
  // Создать страницу оплаты (рекуррентная подписка)
  async createSubscription(params: {
    orderId: string;
    items: Array<{ name: string; price: number; vat: 1 }>;
    installments: number;       // 3 | 6 | 12 по плану
    customerEmail: string;
    customerName: string;
    customerPhone: string;
    successUrl: string;
    failUrl: string;
    metadata: Record<string, string>;
  }): Promise<string>;          // возвращает paymentUrl

  // Верифицировать и обработать вебхук
  async handleWebhook(body: unknown, signature: string): Promise<{
    event: 'payment_success' | 'payment_failed' | 'subscription_cancelled';
    orderId: string;
    metadata: Record<string, string>;
  }>;

  async cancelSubscription(subscriptionId: string): Promise<void>;
  async refund(orderId: string, amount: number): Promise<void>;
}

// Рассрочки по планам
const INSTALLMENTS: Record<string, number> = {
  personal:  3,
  business:  6,
  pro:       6,
  developer: 12,
};

// AllPay payload (с НДС 18% включён)
// customer_id: '000000000' — не запрашивать тз у иностранцев
// vat: 1 — 18% НДС включён в цену
// recurring.interval: 'monthly' — AllPay сохраняет карту и списывает ежемесячно
// Хашбонит мас генерируется автоматически через EasyCount
```

---

## Provisioner (главный оркестратор)

```typescript
// apps/api/src/services/provisioner.ts

export class ProvisionerService {
  // Полный цикл: payment_success → VPS готов → уведомление
  async provision(instanceId: string): Promise<void> {
    // 1. DB: status = 'provisioning'
    // 2. Генерируем credentials (токены, пароли)
    // 3. Рендерим cloud-init с переменными
    // 4. Hetzner: createVPS → получаем { serverId, ipv4 }
    // 5. Cloudflare: создаём A-записи для agent.* и flows.*
    // 6. DB: сохраняем serverId, ip, subdomains, status = 'initializing'
    // 7. Telegram: уведомляем клиента "VPS создаётся (~3 мин)"
    // 8. pollUntilReady() — проверяем каждые 15 сек до 10 мин
    // 9. При готовности: status = 'running', уведомляем с ссылками
  }

  private async pollUntilReady(instanceId: string): Promise<void> {
    // Polling: Hetzner status === 'running'
    // + HTTP GET к agent.{id}.openclaw.flowmatic.co.il/health
    // Timeout: 10 минут → status = 'failed' → alert Сергею
  }

  async suspend(instanceId: string): Promise<void>;   // оплата просрочена
  async resume(instanceId: string): Promise<void>;    // оплата восстановлена
  async terminate(instanceId: string): Promise<void>; // удалить VPS + DNS
}
```

---

## cloud-init Template

```yaml
# scripts/cloud-init-template.yaml
# Переменные (Mustache): {{INSTANCE_ID}} {{OPENCLAW_TOKEN}} 
# {{AUTOMATION_TOOL}} {{AUTOMATION_PORT}} {{AUTOMATION_PASSWORD}}
# {{PLAN}} {{STORAGE_GB}} {{HAS_OLLAMA}}

#cloud-config
package_update: true
packages:
  - docker.io
  - docker-compose-plugin
  - nginx
  - certbot
  - python3-certbot-nginx
  - ufw
  - curl
  - jq

write_files:
  - path: /opt/openclaw/docker-compose.yml
    content: |
      services:
        openclaw:
          image: openclaw/openclaw:latest
          restart: unless-stopped
          ports: ["127.0.0.1:3000:3000"]
          volumes: ["/opt/openclaw/data/openclaw:/home/user/.openclaw"]
          environment:
            - OPENCLAW_AUTH_TOKEN={{OPENCLAW_TOKEN}}
            - OPENCLAW_BIND=0.0.0.0:3000

        n8n:
          image: n8nio/n8n:latest
          restart: unless-stopped
          profiles: ["n8n"]
          ports: ["127.0.0.1:5678:5678"]
          volumes: ["/opt/openclaw/data/n8n:/home/node/.n8n"]
          environment:
            - N8N_BASIC_AUTH_ACTIVE=true
            - N8N_BASIC_AUTH_USER=admin
            - N8N_BASIC_AUTH_PASSWORD={{AUTOMATION_PASSWORD}}
            - WEBHOOK_URL=https://flows.{{INSTANCE_ID}}.openclaw.flowmatic.co.il
            - N8N_HOST=flows.{{INSTANCE_ID}}.openclaw.flowmatic.co.il

        activepieces:
          image: activepieces/activepieces:latest
          restart: unless-stopped
          profiles: ["activepieces"]
          ports: ["127.0.0.1:8080:80"]
          volumes: ["/opt/openclaw/data/ap:/root/.activepieces"]
          environment:
            - AP_FRONTEND_URL=https://flows.{{INSTANCE_ID}}.openclaw.flowmatic.co.il

        {{#HAS_OLLAMA}}
        ollama:
          image: ollama/ollama:latest
          restart: unless-stopped
          ports: ["127.0.0.1:11434:11434"]
          volumes: ["/opt/openclaw/data/ollama:/root/.ollama"]
        {{/HAS_OLLAMA}}

  - path: /etc/nginx/sites-available/openclaw
    content: |
      server {
        listen 80;
        server_name agent.{{INSTANCE_ID}}.openclaw.flowmatic.co.il;
        location / {
          proxy_pass http://127.0.0.1:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_read_timeout 300s;
        }
      }
      server {
        listen 80;
        server_name flows.{{INSTANCE_ID}}.openclaw.flowmatic.co.il;
        location / {
          proxy_pass http://127.0.0.1:{{AUTOMATION_PORT}};
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
        }
      }

  - path: /opt/openclaw/health.sh
    permissions: '0755'
    content: |
      #!/bin/bash
      echo '{"status":"ok","instance":"{{INSTANCE_ID}}"}' | \
        curl -s -X POST https://api.openclaw.flowmatic.co.il/health/heartbeat \
        -H "Content-Type: application/json" -d @-

runcmd:
  # Firewall
  - ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw --force enable
  
  # Create directories
  - mkdir -p /opt/openclaw/data/{openclaw,n8n,ap,ollama}
  
  # Start services
  - |
    cd /opt/openclaw
    docker compose --profile {{AUTOMATION_TOOL}} up -d
    docker compose up -d openclaw
    {{#HAS_OLLAMA}}
    docker compose up -d ollama
    sleep 30 && docker exec ollama ollama pull llama3.1:8b
    {{/HAS_OLLAMA}}
  
  # Nginx
  - ln -sf /etc/nginx/sites-available/openclaw /etc/nginx/sites-enabled/
  - rm -f /etc/nginx/sites-enabled/default
  - nginx -t && systemctl enable nginx && systemctl start nginx
  
  # SSL — polling until DNS propagates
  - |
    for i in $(seq 1 40); do
      certbot --nginx \
        -d agent.{{INSTANCE_ID}}.openclaw.flowmatic.co.il \
        -d flows.{{INSTANCE_ID}}.openclaw.flowmatic.co.il \
        --non-interactive --agree-tos \
        -m devops@flowmatic.co.il && break
      echo "SSL attempt $i failed, waiting 15s..."
      sleep 15
    done
  
  # Auto-update (daily at 3am)
  - |
    echo "0 3 * * * root cd /opt/openclaw && docker compose pull && \
    docker compose up -d --remove-orphans >> /var/log/openclaw-update.log 2>&1" \
    > /etc/cron.d/openclaw-update
  
  # Heartbeat every 5 min
  - echo "*/5 * * * * root /opt/openclaw/health.sh" > /etc/cron.d/openclaw-health
```

---

## Онбординг — шаги по агентам

### Общие шаги (для всех агентов)

```
Шаг 0: ВЫБОР АГЕНТОВ
  → Конфигуратор (уже разработан)
  → Пользователь видит цену и нажимает "Deploy"
  → Редирект на Register

Шаг 1: РЕГИСТРАЦИЯ
  → Email → OTP код (6 цифр, 10 минут)
  → Опционально: имя, телефон
  → JWT сохраняется в localStorage

Шаг 2: ОПЛАТА
  → Показываем summary выбранных компонентов + цену
  → Форма: имя, телефон (если не заполнили)
  → POST /billing/checkout → redirect на AllPay
  → После оплаты: AllPay webhook → provisioner.provision()
  → Редирект на /onboarding/{instanceId}

Шаг 3: VPS ДЕПЛОИТСЯ
  → Animated progress: "מכין את הסביבה שלך..."
  → Polling /instances/{id}/status каждые 10 сек
  → Показываем этапы: Creating → Configuring → Installing → Ready
  → ETA: ~3 минуты
  
Шаг 4: ПОДКЛЮЧЕНИЕ AI ПРОВАЙДЕРА
  → Если выбран 'apikey':
    Показываем инструкцию:
    - Anthropic: console.anthropic.com → API Keys → Create Key
    - OpenAI: platform.openai.com → API Keys → Create Key
    Поле ввода для API ключа (сохраняется в OpenClaw через API)
  → Если выбран 'ollama':
    Автоматически — Llama 3.1 уже качается в фоне
    Показываем прогресс загрузки модели (~5 мин)

Шаг 5: ПОДКЛЮЧЕНИЕ TELEGRAM
  → Инструкция: 
    1. Открыть @BotFather в Telegram
    2. /newbot → дать имя → получить токен
  → Поле для ввода токена
  → После ввода: проверяем токен через OpenClaw API
  → Показываем QR-код или ссылку t.me/{botname}
  → "Напиши своему боту /start чтобы проверить"
```

### Дополнительные шаги для MATEH

```
Шаг 6 (только MATEH): RESEARCH ENGINE
  → "עכשיו נעשה מחקר שוק אמיתי לעסק שלך — ~90 שניות"
  → 7 вопросов прямо на странице (не в боте):
    Q1: שם העסק שלך?
    Q2: מה אתה מוכר / איזה שירות אתה נותן?
    Q3: מי קהל היעד שלך? (תאר בחופשיות)
    Q4: מי המתחרים הישירים שלך? (שמות + URL אם יש)
    Q5: מה המטרה העיקרית של התוכן? (לידים / מכירות ישירות / בניית קהל / מודעות מותג)
    Q6: איזה סוג תוכן אתה מפרסם היום? (או מתכנן?)
    Q7: מה הכי מתסכל אותך בשיווק עכשיו?
  → POST /onboarding/{id}/run-research
  → Progress bar: "מחפש מתחרים..." / "מנתח קהל יעד..." / "מזהה מילות מפתח..."
  → כשמוכן: Preview תוצאות:
    "מצאנו 4 מתחרים, 7 הזדמנויות תוכן, 5 כאבי קהל יעד"
  → [הצג דוח מלא] — открывает боковую панель с research data
  → Файлы USER.md + BRAND.md заливаются на VPS автоматически

Шаг 7 (только MATEH): НАСТРОЙКА DAILY BRIEF
  → "מתי תרצה לקבל את ה-Daily Brief שלך?"
  → Time picker (default: 08:00)
  → "איזה ימים?" (default: ב-ו / Sun-Thu)
  → Сохраняется в n8n как scheduled workflow
```

### Финальный шаг (все агенты)

```
Шаг ФИНАЛ: ГОТОВО! 🎉
  → Конфетти анимация
  → Две большие кнопки:
    [פתח את OpenClaw →]     agent.xxx.openclaw.flowmatic.co.il
    [פתח את n8n / Activepieces →]  flows.xxx.openclaw.flowmatic.co.il
  → Credentials карточки (с кнопкой "показать/скрыть"):
    OpenClaw Token: ****
    n8n Login: admin / ****
  → "שמור אותם במקום בטוח!"
  → Кнопка "עבור לדashboard"
```

---

## Dashboard (ЛК)

Вдохновение: Hostinger hPanel структура — чистый левый сайдбар,
каждый агент имеет свою страницу управления.

### Структура навигации (сайдбар)

```
🏠 Home                  — обзор всех агентов
🤖 הסוכנים שלי           — список + статус каждого
   └── [Agent Name]       — детали: статус, ресурсы, ссылки
⚡ Flows                  — прямая ссылка на n8n/Activepieces
💬 Telegram               — подключённые боты, статус
🔑 API Keys               — AI провайдеры, обновить ключи
💳 Billing                — подписки, история, AllPay
📊 Usage                  — CPU/RAM/Disk графики
❓ Support                — ссылка в Telegram + база знаний
```

### AgentCard компонент

```
┌─────────────────────────────────────────────┐
│ 🟢 MATEH — Marketing Agent          [Open ↗]│
│                                             │
│ flows.abc123.openclaw.flowmatic.co.il  [↗]  │
│                                             │
│ CPU ████░░░░ 38%   RAM ██████░░ 62%         │
│ Uptime: 99.8% · Helsinki · 42ms             │
│                                             │
│ Daily Brief: היום 08:00 ✓                   │
│ Last activity: 12 דקות                      │
│                                             │
│ [⟳ Restart] [📋 Logs] [⬆ Upgrade] [⚙]      │
└─────────────────────────────────────────────┘
```

### Управление агентом (детальная страница)

Секции:
1. **Overview** — статус, ресурсы, uptime
2. **Access** — URLs, credentials (show/hide), SSH (Developer)
3. **Channels** — Telegram бот статус, добавить канал
4. **Automation** — кнопка "Open n8n/Activepieces"
5. **Research** (только MATEH) — последний отчёт, кнопка "обновить"
6. **Backups** — если подключён add-on
7. **Danger Zone** — restart, reinstall, terminate

---

## Telegram — роль в системе

Telegram = **канал уведомлений и доставки**, НЕ точка входа.

### Уведомления которые отправляет платформа:

```typescript
// apps/api/src/services/telegram.ts

const MESSAGES = {
  instance_provisioning: (id: string) => 
    `⚙️ *מכין את הסביבה שלך...*\n` +
    `VPS נוצר, מתקין OpenClaw + n8n\n` +
    `זה ייקח ~3 דקות 🕐`,

  instance_ready: (urls: { agent: string, flows: string }) =>
    `✅ *הסוכן שלך מוכן!*\n\n` +
    `🤖 OpenClaw: ${urls.agent}\n` +
    `⚡ Flows: ${urls.flows}\n\n` +
    `_לחץ על הקישור כדי להתחיל_`,

  payment_failed: (retryUrl: string) =>
    `⚠️ *תשלום נכשל*\n` +
    `[עדכן פרטי תשלום](${retryUrl})`,

  instance_down: (name: string) =>
    `🔴 *הסוכן ${name} לא מגיב*\n` +
    `מנסים להפעיל מחדש אוטומטית...`,

  // MATEH daily brief (שולח n8n, לא הפלטפורמה)
  // research_complete — בתוך האונבורדינג
};
```

### Telegram-бот для MATEH (альтернативный онбординг — ФАЗА 2)

Текущий `bot.js` из `research-engine` переименовать в `mateh-onboarding-bot.ts`.
Интегрировать с платформой: после оплаты на сайте бот автоматически активируется.
Вместо отправки ZIP → вызывает `POST /onboarding/{id}/run-research` с ответами.
**Это ФАЗА 2 — в v1.0 research wizard только в браузере.**

---

## Infra — Управляющий сервер

```yaml
# infra/docker-compose.yml
# Запускается на Hetzner CX21 (~€3.49/мес)
# URL: api.openclaw.flowmatic.co.il

services:
  api:
    build: ../apps/api
    restart: unless-stopped
    env_file: ../.env
    ports: ["3001:3001"]
    depends_on: [postgres]

  web:
    build: ../apps/web
    restart: unless-stopped
    ports: ["3000:3000"]

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes: ["./data/postgres:/var/lib/postgresql/data"]
    environment:
      POSTGRES_DB: openclaw
      POSTGRES_USER: openclaw
      POSTGRES_PASSWORD: ${DB_PASSWORD}

  uptime-kuma:
    image: louislam/uptime-kuma:1
    restart: unless-stopped
    volumes: ["./data/kuma:/app/data"]
    ports: ["3002:3001"]
    # Мониторинг всех клиентских VPS
```

```
# infra/Caddyfile
openclaw.flowmatic.co.il {
  reverse_proxy web:3000
}
api.openclaw.flowmatic.co.il {
  reverse_proxy api:3001
}
status.openclaw.flowmatic.co.il {
  reverse_proxy uptime-kuma:3001
}
```

---

## Спринты разработки

> **Агент:** На каждом спринте — сначала спроси у Сергея все необходимые данные
> (API ключи, домены, аккаунты). Не начинай код если не хватает информации.
> После каждого спринта — покажи что сделано и попроси подтвердить перед следующим.

---

### ⚡ СПРИНТ 0 — Подготовка (День 1, ~2 часа)
**Агент ведёт Сергея через регистрации:**

```
Шаг 0.1: Fork ClawHost
  → Агент: "Иди на https://github.com/bfzli/clawhost и нажми Fork"
  → Переименовать в `openclaw-hosting`
  → git clone https://github.com/{username}/openclaw-hosting
  → cd openclaw-hosting && pnpm install

Шаг 0.2: Hetzner
  → Агент: "Зарегистрируйся на cloud.hetzner.com"
  → Create Project: "openclaw-hosting"
  → API Tokens → Create Token (Read + Write) → сохрани в .env
  → Generate SSH Key: ssh-keygen -t ed25519 -C "openclaw-master"
  → Добавить публичный ключ в Hetzner → записать имя в HETZNER_SSH_KEY_NAME

Шаг 0.3: Cloudflare
  → Агент: "Убедись что flowmatic.co.il управляется через Cloudflare"
  → Получить Zone ID (Overview страница домена)
  → API Tokens → Create Token → Zone:DNS:Edit для flowmatic.co.il
  → Сохранить в .env

Шаг 0.4: AllPay
  → Агент: "Войди на allpay.co.il → Settings → API Integrations"
  → Create Login/Key Pair
  → ALLPAY_TEST_MODE=true на старте
  → Сохранить в .env

Шаг 0.5: Telegram Bot
  → Агент: "Напиши @BotFather: /newbot"
  → Имя: OpenClaw Hosting | username: openclaw_hosting_bot
  → Сохранить токен в TELEGRAM_BOT_TOKEN

Шаг 0.6: Управляющий VPS
  → Создать CX21 на Hetzner (Ubuntu 24.04)
  → Установить Docker + Caddy
  → Настроить DNS: api.openclaw.flowmatic.co.il → IP
```

**Acceptance criteria:** `.env` заполнен, `pnpm dev` запускается без ошибок.

---

### 🏗 СПРИНТ 1 — Core Infrastructure (Дни 2-3)

```
1.1: packages/shared
  → types.ts: Instance, User, Plan, Component, Payment
  → constants.ts: PLANS, COMPONENTS, COMPONENT_RAM, PRICES
  → calcPlan() функция

1.2: apps/api — база
  → Hono.js setup, CORS, JWT middleware
  → PostgreSQL + Drizzle: schema из этого файла
  → pnpm drizzle-kit generate && migrate

1.3: services/hetzner.ts
  → createVPS, deleteVPS, powerOff, powerOn, getStatus, getMetrics
  → Тест: создать CX22 → проверить статус → удалить

1.4: services/cloudflare.ts
  → createSubdomains(instanceId, ip): создаёт agent.* и flows.*
  → deleteSubdomains(instanceId)
  → Тест: создать A-запись → проверить → удалить

1.5: scripts/cloud-init-template.yaml
  → Полный шаблон из этого файла
  → services/cloud-init.ts: render(template, vars) → string
  → Тест: рендер с тестовыми переменными, проверить YAML валидность

1.6: Интеграционный тест (ОБЯЗАТЕЛЬНО)
  → Создать реальный CX22 на Hetzner
  → Применить cloud-init
  → Подождать 3 минуты
  → Проверить: agent.test.openclaw.flowmatic.co.il отвечает
  → Удалить сервер
```

**Агент:** После 1.6 — покажи Сергею логи деплоя и попроси проверить URL.

---

### 💳 СПРИНТ 2 — Billing (Дни 4-5)

```
2.1: services/allpay.ts
  → createSubscription() с рекуррентом
  → handleWebhook() с HMAC верификацией
  → cancelSubscription(), refund()

2.2: routes/billing.ts
  → POST /billing/checkout
  → POST /billing/webhook (без auth!)
  → GET /billing/subscriptions

2.3: services/provisioner.ts
  → provision(): payment_success → VPS → DNS → уведомление
  → pollUntilReady() с timeout
  → suspend(), resume(), terminate()

2.4: services/telegram.ts
  → sendMessage(), все шаблоны уведомлений
  → Тест: отправить сообщение Сергею

2.5: Полный тест billing flow (ОБЯЗАТЕЛЬНО в sandbox!)
  → Выбрать Personal план → checkout → AllPay sandbox
  → Оплатить тестовой картой → вебхук → provisioner
  → VPS создаётся → Telegram уведомление приходит
  → instance.status = 'running'
```

**Агент:** "Сергей, нужна тестовая карта AllPay sandbox. Они обычно дают на странице тестирования. Проверь allpay.co.il/en/api-reference → Test mode."

---

### 🎨 СПРИНТ 3 — Frontend (Дни 6-8)

```
3.1: Vite + React + Tailwind setup
  → RTL support: <html dir="rtl">
  → i18n: react-i18next с he.ts и en.ts
  → Шрифт: Arial/Arial Hebrew (без Google Fonts!)

3.2: components/Header.tsx
  → Лого, ссылка на flowmatic.co.il, nav, языковой переключатель
  → Из готового виджета в этом файле (секция ГОТОВЫЙ КОД)

3.3: components/Footer.tsx
  → Из готового виджета в этом файле

3.4: components/Configurator.tsx
  → ПОЛНЫЙ КОД из секции ГОТОВЫЙ КОД ниже
  → Адаптировать из vanilla JS в React (useState, useEffect)
  → Подключить к POST /instances/configure для live расчёта

3.5: pages/Landing.tsx
  → Hero секция (иврит RTL)
  → Конфигуратор (3.4)
  → Social proof (заглушки для v1)
  → FAQ

3.6: Auth flow
  → pages/Register.tsx: email → OTP → JWT
  → routes/auth.ts: send OTP (nodemailer), verify OTP

3.7: Checkout
  → pages/Checkout.tsx: summary → POST /billing/checkout → redirect
  → После оплаты: redirect на /onboarding/{id}

3.8: pages/Onboarding.tsx
  → Step-by-step wizard
  → Все шаги из секции "Онбординг" выше
  → VPS progress polling
  → Research wizard для MATEH
```

---

### 🖥 СПРИНТ 4 — Dashboard (Дни 9-11)

```
4.1: pages/Dashboard.tsx
  → Список всех instances пользователя
  → AgentCard компонент (статус, метрики, кнопки)

4.2: pages/AgentDetail.tsx
  → Все секции из описания выше
  → ResourceBar компонент (CPU/RAM gauge)
  → StatusBadge (running/initializing/suspended)

4.3: Metrics polling
  → GET /instances/:id/status каждые 30 сек
  → WebSocket для real-time (опционально, можно polling)

4.4: Billing page
  → Активные подписки
  → История платежей (из AllPay + наша DB)
  → Кнопка отмены (с подтверждением)

4.5: Admin page (только для sergei@flowmatic.co.il)
  → Все инстансы с статусами
  → MRR, активные пользователи, Hetzner расходы
  → Кнопки suspend/terminate

4.6: components/Terminal.tsx (только Developer план)
  → xterm.js + node-pty на бэкенде
  → WebSocket tunnel к SSH
```

---

### 🚀 СПРИНТ 5 — Launch (Дни 12-14)

```
5.1: Health monitoring
  → routes/health.ts: POST /health/heartbeat (от клиентских VPS)
  → Cron: каждые 5 мин проверяем все instances
  → Auto-restart если down + alert Сергею

5.2: Error handling
  → Retry logic в provisioner (3 попытки)
  → Graceful fallback если Hetzner недоступен
  → Алерты в Telegram для всех критических ошибок

5.3: SEO & meta
  → og:image, description, lang="he"
  → sitemap.xml

5.4: Деплой управляющего сервера
  → docker-compose up -d на CX21
  → Caddy: auto SSL для всех поддоменов
  → GitHub Actions: auto-deploy при push в main

5.5: Smoke tests перед запуском
  → Полный flow: register → configure → pay → VPS ready
  → Тест с реальной картой (не sandbox)
  → Проверить хашбонит мас в AllPay dashboard
  → Проверить что Telegram уведомление приходит

5.6: Soft launch
  → 3-5 beta пользователей
  → Мониторинг в Uptime Kuma
  → Сбор обратной связи
```

---

## Инструкции для агента разработки

### Как работать с Сергеем

1. **Всегда объясняй** что делаешь и зачем перед кодом
2. **Задавай вопросы** если нужны данные (API ключи, домены, предпочтения)
3. **Проси зарегистрироваться** с конкретными инструкциями и ссылками
4. **Жди подтверждения** после каждого шага который требует действия от Сергея
5. **Показывай прогресс** — что сделано, что следующее
6. **Тестируй перед продолжением** — не пропускай интеграционные тесты
7. **Если что-то непонятно** — спроси, не угадывай
8. **Начни с СПРИНТА 0** — проверь все регистрации прежде чем писать код

### Первое сообщение агенту

Когда Сергей даст тебе этот файл, начни так:

```
Привет! Я прочитал CLAUDE.md и готов вести тебя через разработку 
OpenClaw Hosting Platform.

Начинаем со Спринта 0 — подготовки. Нам нужно 5 вещей:

1. ✅/❌ Hetzner аккаунт (cloud.hetzner.com)
2. ✅/❌ Cloudflare — flowmatic.co.il там управляется?
3. ✅/❌ AllPay аккаунт (allpay.co.il)
4. ✅/❌ Telegram аккаунт для @BotFather
5. ✅/❌ Node.js 20+ и pnpm установлены?

Отметь что есть, что нужно создать — начнём по порядку.
```

---

## Unit Economics Target (3 месяца)

| Метрика | Цель |
|---------|------|
| Активных инстансов | 40 |
| Mix | 40% Business, 30% Pro, 20% Personal, 10% Dev |
| MRR от планов | ~₪11,400 |
| MRR от add-ons | ~₪2,000 |
| **Итого MRR** | **~₪13,400 (~$3,500)** |
| Hetzner расходы | ~₪1,600 |
| **Gross margin** | **~88%** |
| Время деплоя | < 4 мин |
| Uptime | > 99.5% |

---

## Важные ссылки

- ClawHost (база): https://github.com/bfzli/clawhost
- Hetzner Cloud API docs: https://docs.hetzner.cloud/
- Cloudflare API docs: https://developers.cloudflare.com/api/
- AllPay API docs: https://www.allpay.co.il/en/api-reference
- OpenClaw docs: https://docs.openclaw.ai/
- Drizzle ORM: https://orm.drizzle.team/
- Hono.js: https://hono.dev/

