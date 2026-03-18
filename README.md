# Flowmatic — flowmatic.co.il

המשאב הישראלי הראשון ל-OpenClaw.

## מבנה הפרויקט

```
flowmatic_v3/
├── index.html          ← פרוטוטייפ HTML מלא (לפתוח ישירות בדפדפן)
├── public/
│   ├── logo.avif       ← לוגו מקורי
│   ├── logo.png        ← לוגו PNG לתאימות
│   └── avatar.png      ← YouTube avatar
├── package.json        ← Next.js dependencies
├── next.config.js      ← הגדרות Next.js + Cloudflare Pages
└── wrangler.toml       ← Cloudflare Pages build config
```

## בדיקת הפרוטוטייפ

פתחו את `index.html` ישירות בדפדפן — לא נדרש שרת.

## פריסה ל-Cloudflare Pages

### שלב 1 — Node.js setup
```bash
npm install
```

### שלב 2 — Next.js App Router structure
```
mkdir -p app components
```

### שלב 3 — Build ו-Deploy
```bash
npm run build
npx wrangler pages deploy out --project-name flowmatic
```

### שלב 4 — GitHub + Cloudflare Pages (מומלץ)
1. Push ל-GitHub
2. Cloudflare Dashboard → Pages → Connect to Git
3. Build command: `npm run build`
4. Output directory: `out`
5. הוסיפו את הדומיין `flowmatic.co.il`

## הגדרות Environment Variables

```
NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID=your_id
NEXT_PUBLIC_SITE_URL=https://flowmatic.co.il
```

## סטאק

- **Framework**: Next.js 14 (App Router)
- **Hosting**: Cloudflare Pages
- **Fonts**: Heebo (Google Fonts)
- **Newsletter**: Beehiiv
- **Analytics**: Cloudflare Web Analytics (חינמי)

## הוספת עמוד מדריך חדש

צרו קובץ `app/guides/slug/page.tsx` — Next.js יבנה את הנתיב אוטומטית.

---

Built with ♥ by Sergei — flowmatic.co.il
