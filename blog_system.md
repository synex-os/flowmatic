# flowmatic.co.il — מערכת הבלוג
## תיעוד מלא לסוכן Claude

> **מסמך זה מגדיר את כל מה שצריך לדעת לכתיבה, עריכה ותחזוקה של הבלוג.**
> גרסה 1.0 | מרץ 2026

---

## 1. מיסיון ועקרונות יסוד

### המיסיון
flowmatic.co.il הוא המשאב הישראלי הראשון ל-OpenClaw.
אנחנו נותנים מקסימום ערך, בחינם, בעברית.
אין paywall. אין teaser. אין מניפולציה.

### עקרונות בלתי ניתנים לפשרה

**1. הקורא קודם**
כל החלטת תוכן מתחילה בשאלה: "האם זה עוזר לקורא?"
לא "האם זה מגדיל conversions?" ולא "האם זה מביא traffic?"

**2. שקיפות מוחלטת**
- כל לינק אפיליאט מסומן במפורש
- כל דעה מסומנת כדעה
- כשמשהו השתנה מאז כתיבת הפוסט — מעדכנים

**3. אין מניפולציה**
- אין urgency מלאכותית ("קנה עכשיו לפני שיגמר")
- אין fear-based content ("אם לא תעשה X, תפסיד Y")
- אין CTA אגרסיבי

**4. תוכן חי**
- המאמרים מתעדכנים כשהמציאות משתנה
- תאריך עדכון אחרון מוצג תמיד
- מידע ישן מסומן בבירור

---

## 2. ארכיטקטורת התוכן — 4 רמות

### עיקרון הרמות
כל נושא בבלוג מכוסה ב-4 רמות.
הרמות מחוברות זו לזו — קורא יכול להתקדם בקצב שלו.

---

### רמה 1 — בסיס (📗 הדרך הפשוטה)
**מה זה:** המינימום שעובד. אפשר לעשות תוך ערב אחד.
**למי:** כל אחד שרוצה להתחיל.
**כמה זמן:** 10-30 דקות לשלב.
**כלים:** כלים ברירת מחדל, ללא הגדרות מתקדמות.

**מאפיינים:**
- הוראות ברורות, צעד אחר צעד
- צילומי מסך לכל שלב קריטי
- "אם תראו X — זה נורמלי" לנקודות תקיעה נפוצות
- ללא הסברים טכניים מיותרים

---

### רמה 2 — Pro (📘 הדרך הנכונה)
**מה זה:** הגרסה הטובה יותר שלוקחת עוד 30-60 דקות.
**למי:** מי שרוצה תוצאות טובות יותר, לא רק "עובד".
**כמה זמן:** חצי שעה עד שעה נוספת.
**כלים:** Skills נוספים, הגדרות מתקדמות, כלים חיצוניים פשוטים.

**מאפיינים:**
- מסביר למה הדרך הבסיסית מוגבלת
- מציג את השיפור המדיד
- דורש הבנה קלה של מה שנעשה ברמה 1

---

### רמה 3 — Expert (📙 הדרך המקצועית)
**מה זה:** הגרסה שמשתמשים בה כשרציניים.
**למי:** מי שמקים OpenClaw לעסק אמיתי, או רוצה להשקיע.
**כמה זמן:** כמה שעות, לפעמים יותר.
**כלים:** Bright Data, SearXNG self-hosted, multi-agent networks, APIs מתקדמים.

**מאפיינים:**
- מסביר ארכיטקטורה, לא רק הוראות
- כולל שיקולים של עלות/תועלת
- מניח ידע ברמה 1+2
- מציין מפורשות: "זה מורכב — עשו זאת רק אם..."

---

### רמה 4 — מערכת (🔁 ניטור ואנליטיקה)
**מה זה:** איך שומרים על הכל עובד לאורך זמן.
**למי:** מי שכבר מריץ OpenClaw ורוצה לנהל אותו מקצועית.
**היכן:** רק על flowmatic.co.il — לא על YouTube.
**עדכון:** פעם בחודש לפחות.

**מאפיינים:**
- מידע חי שמשתנה עם הזמן
- רשימות ביקורת (checklists) מעשיות
- סימנים לבעיות ואיך לזהות אותן
- ספציפי לישראל (timezone, עלויות בשקלים, כלים ישראלים)

---

## 3. מבנה קובץ מאמר

### Frontmatter (YAML בראש כל קובץ MDX)

```yaml
---
title: "כותרת המאמר בעברית"
title_en: "Article Title in English"
slug: "url-friendly-slug"
description: "תיאור של 155 תווים לSEO. בגוף רבים."
date_created: "2026-03-01"
date_updated: "2026-03-01"
level: "base" # base | pro | expert | system
topic: "setup" # ראה טקסונומיה בסעיף 6
persona: ["gtm-manager", "marketer"] # ראה personas בסעיף 7
youtube_video: "VIDEO_ID" # אם קיים
youtube_timestamp: "12:34" # timestamp רלוונטי בסרטון
affiliate_links: true # אם יש לינקי אפיליאט
series: "openclaw-setup" # אם חלק מסדרה
series_position: 3 # מקום בסדרה
next_level_slug: "competitor-research-pro" # לינק לרמה הבאה
prev_level_slug: null
related: ["soul-md-guide", "sub-agents-basics"]
tags: ["openclaw", "setup", "hostinger"]
---
```

---

## 4. Layout מאמר — מבנה HTML/MDX

### Layout בסיסי (רמות 1-3)

```
┌─────────────────────────────────────────┐
│  BREADCRUMB: מדריכים / נושא / כותרת     │
├─────────────────────────────────────────┤
│  LEVEL BADGE  📗 הדרך הפשוטה            │
│  TITLE                                   │
│  Meta: זמן קריאה · תאריך עדכון          │
├─────────────────────────────────────────┤
│  YouTube EMBED (אם קיים) + timestamp    │
├─────────────────────────────────────────┤
│  INTRO PARAGRAPH — מה תלמדו כאן        │
├─────────────────────────────────────────┤
│  TABLE OF CONTENTS (אם >1000 מילה)     │
├─────────────────────────────────────────┤
│  CONTENT BODY                            │
│  ├── שלבים ממוספרים לפי הצורך           │
│  ├── CODE BLOCKS עם syntax highlight    │
│  ├── CALLOUT BOXES (ראה סעיף 5)        │
│  └── ADVANCED INSERT (ראה סעיף 5)      │
├─────────────────────────────────────────┤
│  LEVEL NAVIGATION                        │
│  ← הדרך הפשוטה  |  הדרך הנכונה →      │
├─────────────────────────────────────────┤
│  RELATED ARTICLES                        │
└─────────────────────────────────────────┘
```

### Layout מאמר "מערכת" (רמה 4)

```
┌─────────────────────────────────────────┐
│  LEVEL BADGE  🔁 ניטור ואנליטיקה        │
│  TITLE + "עדכון אחרון: [תאריך]"        │
├─────────────────────────────────────────┤
│  WHAT'S NEW BOX — מה השתנה לאחרונה    │
├─────────────────────────────────────────┤
│  SYSTEM HEALTH CHECKLIST                │
│  (ניתן לסמן ✓ בדפדפן — localStorage)  │
├─────────────────────────────────────────┤
│  METRICS TABLE — מה לבדוק, מתי, למה   │
├─────────────────────────────────────────┤
│  TROUBLESHOOTING — תסמינים → פתרונות  │
├─────────────────────────────────────────┤
│  ISRAEL-SPECIFIC NOTES                  │
│  (עלויות בשקלים, timezone, כלים מקומי)│
└─────────────────────────────────────────┘
```

---

## 5. Callout Boxes ו-Advanced Inserts

### סוגי Callout Boxes

**💡 טיפ (Tip)**
שימוש: מידע שימושי שאינו קריטי לפעולה.
עיצוב: רקע כחול בהיר, border שמאל כחול.
```mdx
<Tip>
טקסט הטיפ כאן.
</Tip>
```

**⚠️ שימו לב (Warning)**
שימוש: דברים שיכולים ללכת לא טוב אם לא מקפידים.
עיצוב: רקע צהוב בהיר, border שמאל כתום.
```mdx
<Warning>
טקסט האזהרה.
</Warning>
```

**🔴 חשוב (Critical)**
שימוש: טעויות שגורמות לנזק ממשי (כסף, אבטחה, נתונים).
עיצוב: רקע אדום בהיר, border שמאל אדום.
```mdx
<Critical>
טקסט קריטי.
</Critical>
```

**🏷 אפיליאט (Affiliate)**
שימוש: כל אזכור של כלי עם לינק אפיליאט.
עיצוב: badge קטן לצד הלינק. תמיד.
```mdx
<AffiliateLink href="https://..." name="Hostinger">
תיאור קצר למה ממליצים.
</AffiliateLink>
```

---

### Advanced Insert — הפורמט הקריטי

זו הוספה בתוך מאמר בסיסי שמציגה את הרמה הבאה.
**כלל:** Advanced Insert מופיע פעם אחת לכל מאמר, אחרי ה-שלב הרלוונטי שאליו הוא מתייחס.

**מבנה:**

```mdx
<AdvancedInsert
  level="pro"
  title="רוצים לעשות מחקר מתחרים באיכות אמיתית?"
  teaser="הדרך הבסיסית משתמשת ב-Brave Search. הדרך הנכונה משלבת SearXNG self-hosted עם cross-validation ממספר מקורות — ומגיעה לדיוק שאי אפשר להשיג עם API בלבד."
  cta_text="המדריך המלא — הדרך הנכונה"
  cta_href="/guides/competitor-research-pro"
  youtube_href="https://youtube.com/..."
  youtube_timestamp="14:32"
/>
```

**כלל כתיבה:**
- `teaser` — משפט אחד שמסביר מה השיפור הקונקרטי. לא "יותר טוב", אלא "מגיע לדיוק של X% לעומת Y% בגרסה הבסיסית".
- אין מניפולציה. אין "תפסיד!" אין "חובה!". רק עובדות.

---

## 6. טקסונומיה — נושאים

### נושאים ראשיים (topics)

| slug | שם בעברית | תיאור |
|------|-----------|-------|
| `setup` | הגדרה | התקנה, VPS, שרת, פריסה |
| `security` | אבטחה | NemoClaw, הגדרות אבטחה, monitoring |
| `integrations` | אינטגרציות | WhatsApp, Telegram, Google, Slack |
| `skills` | Skills | ClawHub, התקנה, אבטחת Skills |
| `memory` | זיכרון | soul.md, agents.md, user.md, Workspace |
| `automations` | אוטומציות | Cron Jobs, Daily Briefing, workflows |
| `models` | מודלים | ניתוב, fallbacks, Ollama, עלויות |
| `agents` | סוכנים | sub-agents, multi-agent, orchestration |
| `dashboards` | דאשבורדים | openclaw-studio, mudrii, tugcan, office |
| `gtm` | GTM | go-to-market, competitive intel, launch |
| `marketing` | שיווק | תוכן, SEO, מחקר, Social |
| `research` | מחקר | Bright Data, SearXNG, scraping |
| `updates` | עדכונים | גרסאות חדשות, NemoClaw, ecosystem |
| `questions` | שאלות | תשובות לשאלות קהילה |

---

## 7. Personas — לפי מי כותבים

### הגדרת Personas

**`any`** — כולם. מאמרי בסיס שמתאימים לכל מי שמשתמש ב-OpenClaw.

**`business-owner`** — בעל עסק ישראלי, SMB. לא טכני. רוצה תוצאות, לא הבנה.

**`consultant`** — יועץ/פרילנסר שמגדיר OpenClaw ללקוחות. צריך לדעת יותר כדי להסביר.

**`gtm-manager`** — מנהל GTM/Growth. מתעסק ב-competitive intel, launch, מדידה.

**`marketer`** — מנהל שיווק. תוכן, SEO, Social, אנליטיקה.

**`developer`** — מפתח שבונה Skills מותאמים, APIs, אינטגרציות.

### שימוש ב-Frontmatter
```yaml
persona: ["business-owner"] # מאמר לבעל עסק בלבד
persona: ["gtm-manager", "marketer"] # לשני הפרסונות
persona: ["any"] # לכולם
```

---

## 8. חיבורים YouTube ↔ flowmatic.co.il

### עיקרון הצלב (Cross-linking)

```
YouTube Video
    ↓
תיאור הסרטון
    ├── לינק לדף המאמר: flowmatic.co.il/guides/[slug]
    └── לינק לרמה הבאה (Pro): flowmatic.co.il/guides/[slug-pro]

מאמר בסייט
    ├── Embed YouTube
    ├── לינק עם timestamp: youtube.com/watch?v=ID&t=XXs
    └── "לא רוצים לקרוא? הסרטון המלא למעלה [עם timestamp]"
```

### Timestamp Component

```mdx
<YouTubeTimestamp
  videoId="VIDEO_ID"
  time="8:32"
  label="חיבור API Key — מהדקה 8:32 בסרטון"
/>
```

שימוש: כל פעם שמדברים על שלב שמוסבר בסרטון.
מאפשר לקורא לעבור לנקודה המדויקת בסרטון ישירות מהמאמר.

---

## 9. קישורי ניווט בין רמות

### Level Navigation Component

בסוף כל מאמר (לפני Related Articles):

```mdx
<LevelNav
  current="base"
  baseSlug="competitor-research"
  proSlug="competitor-research-pro"
  expertSlug="competitor-research-expert"
  systemSlug="competitor-research-system"
/>
```

תצוגה:
```
📗 הדרך הפשוטה ← [כאן] → 📘 הדרך הנכונה →
```

**כלל:** מציגים רק את הרמות הקיימות. אם pro לא כתוב עדיין — לא מציגים.

---

## 10. מבנה URL

```
flowmatic.co.il/
├── guides/                     # כל המדריכים
│   ├── [slug]/                 # בסיס (ברירת מחדל)
│   ├── [slug]-pro/             # רמה Pro
│   ├── [slug]-expert/          # רמה Expert
│   └── [slug]-system/          # רמה מערכת
├── personas/
│   ├── gtm-manager/            # כל המדריכים ל-GTM
│   └── marketer/               # כל המדריכים למשווק
├── updates/                    # עדכוני OpenClaw
├── questions/                  # שאלות קהילה
└── tools/                      # כלים מומלצים
```

**כלל:** slug בעברית אסור. כל ה-slugs באנגלית קטנה עם מקפים.

---

## 11. SEO ו-AEO

### SEO

**כותרות:**
- H1: כותרת ראשית — מה המאמר עונה עליו, לא שם המוצר
- H2: שלבים ראשיים / שאלות משנה
- H3: פרטים בתוך שלב

**Meta description:**
- תמיד ב-155 תווים בדיוק
- תמיד בגוף רבים ("תלמדו", "תגדירו")
- תמיד עם מילת מפתח ראשית בתחילה

**מילות מפתח עדיפות:**
```
OpenClaw ישראל
OpenClaw עברית
[נושא] OpenClaw
סוכן AI [מקצוע] ישראל
[כלי] OpenClaw מדריך
```

### AEO — Answer Engine Optimization

AEO מכוון לכך שתוכן מ-flowmatic.co.il יופיע בתשובות של Claude, ChatGPT, Perplexity ו-Google AI Mode.

**כללים:**

1. **שאלה ותשובה מפורשת** — כל H2 יכול להיות שאלה. התשובה מגיעה בפסקה הראשונה אחריה, ישירה וברורה.

2. **הגדרות מבוארות** — כל מונח טכני שמוזכר לראשונה מלווה בהסבר קצר באותה שורה.

3. **רשימות ממוספרות לשלבים** — AI מצטט רשימות ממוספרות יותר מפסקות.

4. **Schema markup** — כל מאמר מוגדר כ-`HowTo` או `Article` ב-JSON-LD.

5. **freshness** — תאריך עדכון תמיד מוצג ומעודכן. AI מעדיף תוכן עדכני.

---

## 12. שפה וסגנון כתיבה

### כללי עברית

**פנייה:** גוף רבים תמיד. "תגדירו", לא "תגדיר".

**טון:** ישיר, מקצועי, לא פורמלי מדי.
כמו מקצוען שמסביר לעמית — לא כמו מדריך יבש.

**מונחים טכניים:**
- שמרו על המונח האנגלי בסוגריים בפעם הראשונה
- לאחר מכן אפשר להשתמש בעברית בלבד
- `פריסה (Deploy)`, `מפתח API (API Key)`, `מטמון (Cache)`

**אסור:**
- "פשוט עשו X" — כשX לא פשוט
- "זה קל" — כשזה לא קל לכולם
- הפחדה: "אם לא תעשו X תסבלו"
- superlatives ריקים: "הכי טוב", "מדהים"

**מותר:**
- "אני ממליץ על X כי..." עם סיבה קונקרטית
- "בניסיון שלי..."
- "חלק מהאנשים מעדיפים Y — זה תלוי ב..."

---

## 13. תבנית כתיבה לכל רמה

### תבנית — רמה בסיס

```markdown
## [שלב ממוספר] — [שם השלב]

[פסקה קצרה: מה עושים ולמה]

1. [פעולה ספציפית]
2. [פעולה ספציפית]
3. [פעולה ספציפית]

[Optional: Tip/Warning Callout]

[Optional: Screenshot description]
```

### תבנית — Advanced Insert (בתוך מאמר בסיס)

```markdown
[סיום הסבר שלב בסיסי]

<AdvancedInsert
  level="pro"
  title="[שאלה שהקורא שואל עכשיו]"
  teaser="[שיפור קונקרטי ומדיד]"
  cta_href="/guides/[slug]-pro"
/>

[המשך המאמר הבסיסי]
```

### תבנית — רמה מערכת

```markdown
## בדיקות שבועיות

| מה לבדוק | איפה | כמה אמור להיות | סימן בעיה |
|----------|------|----------------|-----------|
| עלות יומית | Anthropic Console | $0.50-$2 לעסק קטן | >$5/יום |
| Cron jobs | Gateway → Schedule | כולם "last run < 25h" | "failed" |
| ... | ... | ... | ... |

## סימנים שמשהו לא עובד

**הסוכן לא מגיב בטלגרם:**
1. בדקו Credits ב-Anthropic Console
2. פתחו Session חדש: /new
3. בדקו לוגים ב-Gateway

**עלויות גבוהות מהצפוי:**
...
```

---

## 14. סדרות (Series)

### הגדרה
סדרה היא קבוצת מאמרים שעוקבים זה אחר זה.
הקורא צריך לעבור אותם לפי הסדר.

### Series ידועות

**`openclaw-setup`** — הגדרה מאפס (מאמרי הבסיס)
1. מה זה OpenClaw
2. VPS ו-Hostinger
3. Gateway ו-API
4. אבטחה
5. Telegram
6. Google Workspace
7. זיכרון ו-Workspace files

**`marketing-agent`** — סוכן שיווקי
1. בסיס: מחקר מתחרים פשוט
2. Pro: מחקר מעמיק עם SearXNG
3. Expert: Bright Data + multi-agent
4. מערכת: ניטור שוטף

**`gtm-agent`** — סוכן GTM
(בפיתוח)

### Series Navigation Component

```mdx
<SeriesNav
  series="marketing-agent"
  current={2}
  total={4}
/>
```

---

## 15. עדכון תוכן קיים

### מתי לעדכן

- OpenClaw שחרר גרסה חדשה עם שינוי רלוונטי → עדכן מיידי
- שלב שגוי התגלה בפידבק → עדכן מיידי
- מחיר/תוכנית של כלי השתנה → עדכן תוך שבוע
- עדכון שוטף לרמת "מערכת" → פעם בחודש

### כיצד לסמן עדכון

```yaml
date_updated: "2026-04-15"
```

```mdx
<UpdateNote date="2026-04-15">
עדכנו את שלב 3 בעקבות שינוי בממשק Hostinger מגרסה 2.4.
</UpdateNote>
```

### מידע ישן — Never Delete

אם מידע השתנה — אל תמחקו את הישן. סמנו אותו:

```mdx
<Deprecated since="2026-03" replaced_by="/guides/new-method">
הדרך הישנה להתקין X. עדיין עובדת אבל כבר לא מומלצת.
</Deprecated>
```

---

## 16. Questions Series — שאלות קהילה

### תהליך

1. שאלה מגיעה בתגובות YouTube / Facebook / ישירות
2. אם נשאלה ≥3 פעמים → הופכת לפוסט
3. אם נשאלה פעם אחת אבל טיפוסית → הופכת לפוסט
4. תמיד מקשרים לשאלה המקורית (YouTube comment link)

### Template שאלה

```yaml
---
title: "שאלה: [השאלה המקורית]"
topic: "questions"
original_question_source: "youtube_comment" # youtube_comment | facebook | direct
related_guides: ["guide-slug-1", "guide-slug-2"]
---
```

```markdown
# [השאלה]

> שאלה מ-[שם] בתגובות: "[ציטוט מדויק]"

## התשובה הקצרה

[פסקה אחת, תשובה ישירה]

## הסבר מלא

[הסבר מורחב עם שלבים אם צריך]

## קריאה נוספת

- [מאמר רלוונטי 1]
- [מאמר רלוונטי 2]
```

---

## 17. Tools Page

### מבנה כרטיס כלי

```mdx
<ToolCard
  name="Hostinger VPS"
  category="hosting"
  affiliate={true}
  affiliate_disclosure="מקבלים עמלה על כל רכישה — לא משפיע על ההמלצה"
  href="https://hostinger.com/..."
  why="תבנית OpenClaw מוכנה — ללא Terminal, ללא Docker"
  best_for="מתחילים שרוצים להתחיל מהר"
  not_for="מי שרוצה ספק ישראלי (אין להם datacenter בישראל)"
  price_range="$7-20/month"
  tested={true}
/>
```

**חובה לכלול `not_for`** — זה מה שבונה אמון.

---

## 18. Localization לישראל

### תמיד לציין

- מחירים בשקלים (₪) לצד הדולרים ($) — השתמשו ב-`~₪X` לפי שער יציג
- Timezone: `UTC+2` (חורף) / `UTC+3` (קיץ) — תמיד ציינו
- ימי עבודה: א'-ה', לא שני-שישי
- שישי אחה"צ / שבת — ציינו כ"מחוץ לשעות עבודה" כשרלוונטי

### Israel-Specific Notes Component

```mdx
<IsraelNote>
בישראל: שרת אירופה (Frankfurt/Amsterdam) הוא הבחירה הנכונה —
זמן תגובה של ~30ms לעומת ~150ms לשרת אמריקאי.
</IsraelNote>
```

---

## 19. Analytics ו-Feedback

### מה עוקבים

- Scroll depth לכל מאמר — האם קוראים עד הסוף?
- Clicks על Advanced Insert — כמה עוברים לרמה הבאה?
- YouTube timestamp clicks — האם הקישורים עובדים?
- Time on page — האם התוכן מספיק מפורט?

### Feedback Component

בסוף כל מאמר:

```mdx
<FeedbackWidget
  question="האם המדריך הזה עזר לכם?"
  options={["כן, הצלחתי", "כן, אבל נתקעתי ב...", "לא, כי..."]}
  followup="אם נתקעתם — ספרו לנו איפה ונעדכן את המדריך"
/>
```

---

## 20. Checklist לפני פרסום

```
[ ] Frontmatter מלא וחוקי
[ ] Level badge נכון (📗/📘/📙/🔁)
[ ] Advanced Insert קיים אם רלוונטי
[ ] כל לינק אפיליאט מסומן
[ ] Meta description — בדיוק 155 תווים
[ ] YouTube embed ו-timestamp (אם קיים)
[ ] Level Navigation Component בסוף
[ ] Related Articles — 2-3 מאמרים
[ ] date_updated עדכני
[ ] IsraelNote היכן שרלוונטי
[ ] Feedback Widget בסוף
[ ] בדיקת לינקים (כולם עובדים?)
[ ] קריאה חוזרת — האם ניתן לבצע את כל השלבים מהמאמר בלבד?
```

---

## נספח — גלוסרי

| מונח אנגלי | עברית מומלצת |
|------------|-------------|
| Deploy | פריסה |
| Gateway | שער / Gateway (שמרו את המונח) |
| Skill | Skill (שמרו) |
| Sub-agent | סאב-אגנט |
| Workspace | Workspace |
| Bootstrap | Bootstrap (שלב האיפוס הראשוני) |
| Cron Job | משימה מתוזמנת |
| Fallback | ברירת גיבוי |
| Model routing | ניתוב מודלים |
| soul.md | קובץ הנשמה (אבל תמיד ציינו soul.md) |
| Rate limit | מגבלת קצב |
| API Key | מפתח API |
| Token | טוקן |
| Session | סשן / שיחה |
| Pairing | חיבור / שיוך |

---

*מסמך זה מתעדכן עם כל שינוי משמעותי במדיניות התוכן של flowmatic.co.il*
*גרסה נוכחית: 1.0 | מרץ 2026*
