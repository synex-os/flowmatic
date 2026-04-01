# Flowmatic + ClawFlow — Project Brief

## Что это

**Flowmatic** (flowmatic.co.il) — контентная платформа и экосистема вокруг OpenClaw AI агентов для израильского рынка. Иврит по умолчанию.

**ClawFlow** (clawflow.flowmatic.co.il) — SaaS продукт: Hosting-as-a-Service для OpenClaw AI агентов. Пользователь выбирает конфигурацию → платит → получает готовый VPS с работающим агентом через 3 минуты.

**Владелец:** Sergei Gofman, ע.מ. 324503853, Нетания, Израиль.

---

## Бизнес-модель

- **Контент** (flowmatic.co.il) — бесплатный, без paywall. Мדריকики, видео, блог на иврите.
- **ClawFlow** — платная подписка: ₪79-599/мес в зависимости от плана.
- **Human as a Service** — ручная помощь с настройкой, оплата по кейсу.
- **Аффилиат** — Hostinger, ElevenLabs и другие (всегда маркирован).
- **קול VoiceAI** (kol-ai.xyz) — отдельный продукт, AI голосовой агент для звонков. Beta.

---

## Продукты в ClawFlow

### 1. OpenClaw Personal (עוזר אישי)
- Личный AI ассистент: יומן, мיילים, напоминания, поиск, черновики
- Подключается к Telegram, Google Workspace, Microsoft 365
- Daily briefing каждое утро в Telegram
- RAM: 1GB, VPS: Hetzner CX22, цена: ₪79/мес

### 2. MATEH (סוכן שיווק)
- Маркетинговая система с 8 суб-агентами:
  - סייר (мчקר מתחרים), מאתר (SEO), מאזין (соцсети), מנתח (אנליза),
  - עט (כתיבת תוכן), יוצר (ויזואלים), שליח (הפצה), מגדלור (AEO)
- Daily brief, weekly competitive report, monthly AEO audit
- Публикация: Instagram, Facebook, Google Ads, Meta Ads, WordPress, Newsletter
- Approval Queue — всё проходит через одобрение пользователя
- RAM: 4GB, VPS: Hetzner CX32 минимум, цена: от ₪169/мес

### 3. OpenClaw Bare (נקי)
- Чистый VPS с OpenClaw без предустановленных агентов
- Для разработчиков, полный SSH доступ

---

## Технический стек

### Frontend (flowmatic.co.il)
- **Next.js 14** (App Router, static export → `output: 'export'`)
- **Cloudflare Pages** (CDN, деплой автоматически из GitHub push)
- MDX для блога с кастомным рендерером (не стандартный MDX)
- Heebo + DM Mono шрифты
- RTL (dir="rtl", lang="he")

### Frontend (clawflow.flowmatic.co.il)
- **Vanilla HTML/CSS/JS** — 10 standalone HTML файлов
- Нет фреймворка, нет build step
- Деплой: git pull на VPS → cp HTML to dist/, Caddy отдаёт
- RTL Hebrew

### Backend API (api.clawflow.flowmatic.co.il)
- **Hono.js** (lightweight HTTP framework)
- **TypeScript** с tsx runtime
- **Drizzle ORM** + **PostgreSQL 16** (Docker)
- **Systemd** сервис (openclaw-api)
- WebSocket: чат + терминал (xterm.js на фронте)

### Инфраструктура
- **Management VPS:** 204.168.207.193 (Hetzner)
  - API, frontend (Caddy reverse proxy), PostgreSQL, Uptime Kuma
- **Client VPS:** Hetzner (создаётся автоматически per user)
  - Ubuntu 22.04, Docker, Node.js 22, Nginx, Certbot
  - OpenClaw gateway, n8n/Activepieces, опционально Ollama
- **DNS:** Cloudflare (flowmatic.co.il zone)
- **SSL:** Let's Encrypt (auto via Certbot на client VPS), Caddy (management)
- **Биллинг:** AllPay (израильский процессор, рекуррентные платежи, חשבונית מס)

### Provisioning pipeline
1. Пользователь платит → AllPay webhook → API
2. API создаёт Hetzner VPS через cloud-init template
3. Cloud-init устанавливает: OpenClaw, Docker, Nginx, SSL, automation tool
4. API polling каждые 8 сек до ready
5. Пользователь проходит onboarding: API key → Telegram → agent setup
6. Agent system deployed via SSH (SOUL.md, USER.md, AGENTS.md, cron jobs)

### Интеграции (OAuth через dashboard UI)
- **Google Workspace** — Calendar, Gmail (readonly+send), Drive (readonly), Sheets, Ads
- **Microsoft 365** — Mail (read+send), Calendar, OneDrive, Tasks, Teams, Contacts
- **Meta** — Facebook Pages, Instagram, Meta Ads
- **Telegram** — бот через BotFather token
- **Brave Search** — web search API
- **Replicate** — image generation (FLUX, Stable Diffusion)
- **WordPress** — direct publishing via REST API
- **SMTP/Resend** — email sending

### Memory Layer (Mem0)
- **Qdrant** — vector database (Docker container на каждом VPS)
- **mem0ai** — npm package для OpenClaw integration
- Hebrew-aware extraction prompt (сохраняет факты на языке оригинала)
- Auto-capture: факты сохраняются при разговоре
- Auto-recall: релевантные воспоминания подгружаются перед ответом
- MATEH: shared memory между 8 суб-агентами (סייר нашёл → מנתח учитывает)
- Config: `/home/openclaw/.openclaw/memory/mem0-config.json`

### Безопасность
- OAuth scopes ужесточены: email = read+send only, no delete/modify
- SOUL.md содержит security rules (не делить API keys, аישור перед действиями)
- Approval Queue — все agent outputs проходят через одобрение
- AGENTS.md — 10 min timeout на процессы, 3 fail → stop
- UFW firewall, SSL, non-root openclaw user на client VPS
- 2FA в dashboard (TOTP)

---

## Dashboard (clawflow)

Tabs:
- **Home** — status, approval queue с горячими клавишами (א/ת/פ/ד), notifications
- **Chat** — embedded OpenClaw chat (iframe), synced with Telegram
- **Agents** — agent config, business questionnaire, cron schedules, sub-agents
- **Integrations** — все OAuth подключения в одном месте
- **Developer** — File Manager, Terminal (xterm.js SSH), logs, server stats (CPU/RAM/Disk), backups
- **Settings** — profile, plan, 2FA, cancel

---

## SEO & Analytics

### flowmatic.co.il
- Plausible Analytics (privacy-friendly, без cookies)
- Google Search Console (sitemap submitted)
- JSON-LD: WebSite, Organization, FAQPage, HowTo (с steps)
- OG image уникальный per post (1200x630 branded PNG)
- Keywords: 22 таргетированных (סוכן AI, בינה מלאכותית לעסקים, אוטומציה, Claude API etc.)
- robots.txt разрешает AI ботов (GPTBot, ClaudeBot, PerplexityBot)
- Blog: sticky TOC с якорями, breadcrumbs, responsive

### clawflow.flowmatic.co.il
- Plausible (same dashboard, filter by hostname)
- Funnel events: Deploy Click → Signup Complete → Checkout Started → Payment Success
- robots.txt: public pages only, auth pages blocked
- sitemap.xml: 5 public pages

---

## Контент

### Blog (flowmatic.co.il/blog/)
- MDX файлы в `content/guides/`
- Shared layout: SiteNav (client component, mega menu) + SiteFooter
- Кастомные компоненты: Tip, Warning, Critical, IsraelNote, ScreenPlaceholder
- Sticky sidebar TOC, auto-generated anchor IDs на иврите

### YouTube
- Канал: @OpenClawIsrael
- Скрипты в `script.md` (synced с blog content)

---

## Ключевые файлы

### flowmatic (Next.js)
- `app/layout.tsx` — metadata, Plausible, SiteNav, SiteFooter
- `app/page.tsx` — главная страница (hero, philosophy, guides, tools, HaaS)
- `app/blog/[slug]/page.tsx` — blog post template (TOC, HowTo schema, FAQ schema)
- `content/guides/*.mdx` — blog posts
- `components/SiteNav.tsx` — shared navigation с mega menu
- `components/SiteFooter.tsx` — shared footer
- `components/mdx-remote-wrapper.tsx` — MDX→HTML renderer

### openclaw-hosting (ClawFlow)
- `apps/web/public/*.html` — 10 frontend pages
- `apps/api/src/routes/hosting.ts` — all API routes
- `apps/api/src/controllers/hosting/` — controllers:
  - `billing.ts` — checkout, AllPay webhook
  - `agentSetup.ts` — MATEH + Personal agent setup, Claude generation
  - `google.ts` / `microsoft.ts` / `meta.ts` — OAuth integrations
  - `outputs.ts` — approval queue, publishing pipeline
  - `instances.ts` — VPS management
- `apps/api/src/services/provisioner.ts` — VPS creation orchestrator
- `scripts/cloud-init-template.yaml` — what gets installed on each VPS
- `templates/mateh-system/` — MATEH agent SOUL.md files (8 agents)
- `templates/personal-system/` — Personal agent templates

### Деплой
- **flowmatic** → push to master → Cloudflare Pages auto-build
- **clawflow frontend** → push to Production → SSH to 204.168.207.193 → `git pull && cp HTML to dist/`
- **clawflow API** → same SSH + `systemctl restart openclaw-api`

---

## Текущий статус (апрель 2026)

- AllPay live (production mode), оплата работает
- Provisioning работает (Hetzner VPS auto-deploy)
- Onboarding: Personal (5 steps) + MATEH (7 steps)
- Google OAuth, Microsoft 365 OAuth, Meta OAuth — подключены
- Plausible Analytics — live на обоих сайтах
- Google Search Console — sitemaps submitted
- Blog: 1 опубликованный пост (complete guide, переписан под ClawFlow)
- YouTube: скрипт готов, видео в продакшене
- MATEH guide: в планах
