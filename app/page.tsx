'use client'

import { useEffect, useState, ReactNode } from 'react'

type CoursePick = 'owners' | 'pros' | 'both'

const Tip = ({ children, text, wide }: { children: ReactNode; text: string; wide?: boolean }) => (
  <span className={`tip ${wide ? 'tip-wide' : ''}`}>
    {children}
    <span className="tip-body">{text}</span>
  </span>
)

/* ── SVG icons (Lucide-style stroke). Size via CSS on wrapping container. */
const sx = (path: ReactNode): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{path}</svg>
)
const IStore     = () => sx(<><path d="m2 7 2-4h16l2 4"/><path d="M4 7v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7"/><path d="M8 12h8"/><path d="M2 7c0 2 1 3 3 3s3-1 3-3c0 2 1 3 3 3s3-1 3-3c0 2 1 3 3 3s3-1 3-3"/></>)
const IRocket    = () => sx(<><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></>)
const IInfinity  = () => sx(<path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/>)
const IRefresh   = () => sx(<><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M8 16H3v5"/></>)
const ISearch    = () => sx(<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>)
const ITarget    = () => sx(<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>)
const IPalette   = () => sx(<><circle cx="12" cy="12" r="10"/><circle cx="8" cy="10" r="1.2"/><circle cx="12" cy="8" r="1.2"/><circle cx="16" cy="10" r="1.2"/><path d="M12 22a4 4 0 0 0 4-4c0-1-1-1.5-2-1.5h-1c-1.3 0-2-1-2-2s.7-2 2-2h1.5c1.3 0 2.5-.7 3-2"/></>)
const IPen       = () => sx(<><path d="M12 19 7 22l3-5"/><path d="m20.5 6.5-3-3L5 16v3h3Z"/><path d="m15 5 3 3"/></>)
const IMegaphone = () => sx(<><path d="M3 11v2a2 2 0 0 0 2 2h2l8 5V4L7 9H5a2 2 0 0 0-2 2Z"/><path d="M18 8a5 5 0 0 1 0 8"/></>)
const ICheck     = () => sx(<><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></>)
const IBook      = () => sx(<><path d="M4 4h12a4 4 0 0 1 4 4v13H6a2 2 0 0 1-2-2Z"/><path d="M4 19a2 2 0 0 1 2-2h14"/><path d="M8 8h8"/><path d="M8 12h6"/></>)
const ICompass   = () => sx(<><circle cx="12" cy="12" r="10"/><path d="m16 8-2 6-6 2 2-6 6-2Z"/></>)
const ITrendUp   = () => sx(<><path d="m3 17 6-6 4 4 8-8"/><path d="M21 7v7h-7"/></>)
const ICoins     = () => sx(<><circle cx="9" cy="9" r="5"/><circle cx="15" cy="15" r="5"/></>)
const IUsers     = () => sx(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>)
const IBrain     = () => sx(<path d="M9 2a3 3 0 0 1 3 3v14a3 3 0 0 1-6 0v-1a3 3 0 0 1-2-5 3 3 0 0 1 1-5 3 3 0 0 1 1-5 3 3 0 0 1 3-1Zm6 0a3 3 0 0 0-3 3v14a3 3 0 0 0 6 0v-1a3 3 0 0 0 2-5 3 3 0 0 0-1-5 3 3 0 0 0-1-5 3 3 0 0 0-3-1Z"/>)
const ICode      = () => sx(<><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></>)
const IZap       = () => sx(<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>)
const ILayers    = () => sx(<><path d="m12 2 10 6-10 6L2 8Z"/><path d="m2 14 10 6 10-6"/><path d="m2 11 10 6 10-6"/></>)
const ILightbulb = () => sx(<><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z"/></>)

export default function Home() {
  const [coursePick, setCoursePick] = useState<CoursePick>('owners')
  const [openModule, setOpenModule] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIntent, setModalIntent] = useState<'trial' | 'buy'>('trial')

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in') })
      },
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setDrawerOpen(false); setModalOpen(false) }
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  useEffect(() => {
    document.body.style.overflow = (drawerOpen || modalOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen, modalOpen])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openTrialFor = (c: CoursePick) => { setCoursePick(c); setModalIntent('trial'); setModalOpen(true) }
  const openBuyFor   = (c: CoursePick) => { setCoursePick(c); setModalIntent('buy'); setModalOpen(true) }

  const submitModal = () => {
    const name = (document.getElementById('md-name') as HTMLInputElement)?.value?.trim()
    const email = (document.getElementById('md-email') as HTMLInputElement)?.value?.trim()
    if (!email || !email.includes('@')) { alert('אנא הזינו אימייל תקין'); return }
    if (!name) { alert('אנא מלאו שם'); return }

    const btn = document.getElementById('md-submit') as HTMLButtonElement
    btn.disabled = true; btn.textContent = 'שולח...'

    const courseLabel = coursePick === 'owners' ? 'המסלול לבעלי עסקים — ₪199'
                      : coursePick === 'pros'   ? 'המסלול למשווקים מקצועיים — ₪1,499'
                      : 'שני המסלולים'
    const intentLabel = modalIntent === 'trial' ? 'שיעור ראשון חינם' : 'בקשת רכישה'
    const message = `${intentLabel}\nמסלול: ${courseLabel}\nאימייל: ${email}`

    fetch('https://api.clawflow.flowmatic.co.il/hosting/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone: email,
        type: `${intentLabel} — ${courseLabel}`,
        message
      })
    }).then(r => r.json()).then(() => {
      document.getElementById('md-success')!.style.display = ''
      btn.style.display = 'none'
      fetch('https://api.clawflow.flowmatic.co.il/hosting/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      }).catch(() => {})
    }).catch(() => {
      btn.disabled = false; btn.textContent = modalIntent === 'trial' ? 'קבלו גישה חינם ←' : 'שלחו בקשת רכישה ←'
      alert('שגיאה בשליחה, נסו שוב')
    })
  }

  const courseSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Flowmatic Academy — Business Owners Track',
      description: 'הקורס המלא לבעלי עסקים בישראל: לנהל לבד את כל מחזור השיווק בעזרת סוכני AI, ללא רקע טכני',
      provider: { '@type': 'Organization', name: 'Flowmatic', url: 'https://flowmatic.co.il' },
      offers: { '@type': 'Offer', price: '199', priceCurrency: 'ILS' }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Flowmatic Academy — Marketing Professionals Track',
      description: 'מסלול מומחיות למשווקים מקצועיים: לבנות מערכי שיווק AI עבור לקוחות ולהקים סוכנות דיגיטלית מבוססת ClawFlow',
      provider: { '@type': 'Organization', name: 'Flowmatic', url: 'https://flowmatic.co.il' },
      offers: { '@type': 'Offer', price: '1499', priceCurrency: 'ILS' }
    }
  ]

  const ownersModules = [
    { id: 'o1', title: 'להתחיל תוך 10 דקות — ממש פשוט', duration: '15 דק׳', points: [
      'מה זה סוכן AI — בשפה של בן אדם, לא של מתכנת',
      'איך הפלטפורמה שלנו חוסכת לכם את כל הצד הטכני',
      'איך בוחרים את התוכנית הנכונה — ואיך לא לשלם על מה שלא צריכים',
      'הרשמה, אימות במייל, והגנה על החשבון',
      'סיור ראשון בלוח הבקרה — מה רואים ואיפה'
    ]},
    { id: 'o2', title: 'ההגדרה הראשונית — הסוכן לומד את העסק שלכם', duration: '25 דק׳', points: [
      'איך השרת שלכם עולה אוטומטית תוך 3 דקות — בלי מסך שחור, בלי קוד',
      'חיבור המוח של הסוכן (Claude) — אישור חד-פעמי, בלי לגעת בזה שוב',
      'יצירת בוט טלגרם — שישלח לכם עדכונים וישמש אתכם לצ׳אט עם הסוכן',
      '11 שאלות על העסק שלכם שהופכות את הסוכן למומחה בתחום שלכם',
      'מה המערכת עושה מאחורי הקלעים בזמן שהיא מנתחת את התשובות שלכם',
      'מתי לקבל Daily Brief — הסיכום השיווקי היומי שלכם'
    ]},
    { id: 'o3', title: 'לוח הבקרה — 5 מסכים שאתם תשתמשו בהם כל יום', duration: '30 דק׳', points: [
      'מסך הבית — מה קרה, מה דורש תשומת לב, מה בתור',
      'תור האישורים — הכי חשוב: אתם מאשרים תוכן לפני שהוא יוצא',
      'לוח התוכן — רואים מראש מה יפורסם השבוע ובאיזה ערוץ',
      'צ׳אט ישיר עם הסוכן — "תכתוב לי פוסט על..." וזה קורה',
      'מעבר בין הסוכנים השונים, ושימוש במובייל מכל מקום'
    ]},
    { id: 'o4', title: 'חיבור כל הכלים שכבר יש לכם', duration: '40 דק׳', points: [
      'חיבור Gmail, Calendar ו-Drive — הסוכן יכול לקרוא מיילים ולקבוע פגישות',
      'חיבור Google Search Console — המערכת רואה איך אתם בגוגל',
      'חיבור פייסבוק ואינסטגרם — פרסום ישיר, בלי להיכנס לכל ערוץ',
      'חיבור WhatsApp Business — שליחת עדכונים ללקוחות',
      'חיבור Google Business Profile — פוסטים וניהול ביקורות בקליק',
      'חיבור Google Ads — בסיס לפרסום ממומן מתוזמן'
    ]},
    { id: 'o5', title: '9 הסוכנים שעובדים בשבילכם — מי עושה מה', duration: '30 דק׳', points: [
      'הסוכן שעוקב אחרי המתחרים (Sayer) — דוח שבועי',
      'הסוכן שבודק את המיקום שלכם בגוגל (Meater) — כל יום',
      'הסוכן שמאזין לרשתות לדיבורים על המותג (Maazin)',
      'הסוכן שמכין לכם סיכום יומי (Menateach) — קפה ו-5 דקות',
      'הסוכנים שכותבים ומעצבים לכם תוכן (Ayat, Yotzer)',
      'הסוכן שמפרסם לכם (Shaliach) — בזמן הנכון, בערוץ הנכון',
      'הסוכן שבודק את הנוכחות שלכם ב-AI (Migdalor)',
      'הסוכן שעוזר בעיצוב המותג (Mekhayev)'
    ]},
    { id: 'o6', title: 'השגרה היומית — 15 דקות בבוקר, וזהו', duration: '20 דק׳', points: [
      'מה לבדוק בבוקר — צ׳ק-ליסט קצר של 5 דברים',
      'איך לתת פידבק לסוכן כדי שילמד ויתקן את עצמו',
      'מה לעשות כשהתוצאה לא טובה — 3 דרכים לתקן לבד',
      'מתי זו בעיה שלכם, ומתי זה רגע להרים טלפון ל-HAAS',
      'בונוס: רשימת המשימות של השבוע הראשון שלכם'
    ]}
  ]

  const prosModules = [
    { id: 'p1', title: 'הארכיטקטורה מאחורי הקלעים', duration: '60 דק׳', points: [
      'OpenClaw מול פריימוורקים אחרים (LangChain, CrewAI) — החלטות עיצוב',
      'Cloud-init — איך השרת מקים את עצמו אוטומטית',
      'בחירת VPS לפי עומס — Hetzner/DigitalOcean/Vultr ומתי מה',
      'ניהול Docker, nginx, Caddy, וחידוש SSL אוטומטי',
      'אופטימיזציית RAM ו-swap — למה 4GB מספיקים ומתי לשדרג'
    ]},
    { id: 'p2', title: 'אסטרטגיית מודלים — חיסכון של 90% בעלויות', duration: '60 דק׳', points: [
      'Claude Haiku/Sonnet/Opus — איזה מודל לאיזו משימה',
      'איך לשלם $2 במקום $200 על אותה איכות פלט',
      'LiteLLM Gateway — caching, rate limiting, observability',
      'Ollama (מודל AI שרץ מקומי) — מתי זה משתלם ומתי לא',
      'OpenAI כגיבוי — ניתוב חכם בין ספקים'
    ]},
    { id: 'p3', title: 'USER.md, BRAND.md ו-Skills מותאמים', duration: '90 דק׳', points: [
      'אנטומיית USER.md — הזיכרון של הסוכן על העסק',
      'BRAND.md — קול, טון, עקביות זהות (Entity Consensus)',
      'כתיבת Skills מותאמים ב-Python ו-Node',
      'סקירת ClawHub Marketplace — Skills מוכנים לשימוש',
      'תרגיל חי: עורכים USER.md ישירות מתוך הפלטפורמה'
    ]},
    { id: 'p4', title: '9 סוכני MATEH — הנדסה הפוכה מלאה', duration: '120 דק׳', points: [
      'Sayer — קונפיגורציה, prompts, מודלים, cron',
      'Meater — סריקת SERP יומית דרך DataForSEO',
      'Maazin — האזנה חברתית בפייסבוק וברדיט',
      'Menateach — סינתזה ממקורות מרובים לסיכום יומי',
      'Ayat/Et — ניסוח תוכן עם Entity Consensus',
      'Yotzer — pipeline יצירת ויזואלים',
      'Shaliach — פרסום רב-ערוצי ומעקב CTR',
      'Migdalor — איך לגרום לסוכן שלכם להיות מצוטט ב-ChatGPT ו-Perplexity',
      'Mekhayev — יצירת Brand Book אוטומטית'
    ]},
    { id: 'p5', title: 'מנוע מחקר + זיכרון (RAG)', duration: '90 דק׳', points: [
      'Crawl4AI — סריקה עמוקה של אתרי מתחרים',
      'Firecrawl — חילוץ נתונים מובנים מאתרים',
      'DataForSEO — מחקר מילות מפתח, SERP features, AEO',
      'Mem0 + Qdrant (Vector DB) — זיכרון ארוך-טווח של הסוכן',
      'Knowledge Base — העלאת מסמכים לזיכרון הסוכן (RAG)',
      'Reddit API ו-social listening מתקדם'
    ]},
    { id: 'p6', title: 'CrewAI — צוותי סוכנים מורכבים', duration: '75 דק׳', points: [
      'מתי OpenClaw לבד לא מספיק — התפקיד של CrewAI',
      'בניית Crew מותאם ללקוח',
      'דפוסי Orchestration בין סוכנים',
      'Deploy · Run · Monitor לייצור'
    ]},
    { id: 'p7', title: 'SEO + AEO — להופיע בגוגל וב-AI', duration: '90 דק׳', points: [
      'חיבור Google Search Console ושימוש בנתונים',
      'SEO First-run Wizard — איך להביא את האתר ל-100%',
      'אוטומציית Schema Markup (הקוד ש"מסביר" את האתר לגוגל)',
      'AEO — האופטימיזציה החדשה: להופיע בתשובות של ChatGPT',
      'Entity Consensus — למה גוגל מדרגים אתכם טוב יותר',
      'Migdalor workflow — איך לבדוק שאתם מופיעים ב-LLMs'
    ]},
    { id: 'p8', title: 'פרסום ממומן אוטומטי', duration: '90 דק׳', points: [
      'Google Ads Developer Token — הגדרה מלאה',
      'מבנה MCC (חשבון-על) לסוכנויות',
      'יצירת קמפיינים דרך API — לא ידנית',
      'Meta Ads — pipeline לפייסבוק ואינסטגרם',
      'Creative Automation — 16+ קריאייטיבים לחודש',
      'ROAS reporting ולולאות אופטימיזציה'
    ]},
    { id: 'p9', title: 'ניהול ערוצים בסקייל', duration: '60 דק׳', points: [
      'WhatsApp Business — broadcasts + אישור תבניות במטא',
      'Google Business Profile — פוסטים וטיפול בביקורות',
      'Activepieces — אוטומציות מעבר למה שהסוכן לבד יכול',
      'תזמון משימות (cron) — אסטרטגיה שלמה'
    ]},
    { id: 'p10', title: 'לשונית המפתח — SSH, API, גיבויים', duration: '60 דק׳', points: [
      'Terminal מובנה בדפדפן — מה אפשר לעשות',
      'Console + Logs — debugging של הסוכנים',
      'API Token — אינטגרציות עם מערכות חיצוניות שלכם',
      'אסטרטגיית גיבויים ושחזור',
      'Health Monitoring + ריפוי עצמי של המערכת',
      'LLM Guard — הגנה מ-Prompt Injection (התקפות על הסוכן)'
    ]},
    { id: 'p11', title: 'בניית סוכנות דיגיטלית מבוססת ClawFlow', duration: '75 דק׳', points: [
      'Pricing Model ללקוחות — תוספת של ₪250-2,000 לחודש',
      'Onboarding ללקוח תוך יום עבודה אחד',
      'White-label — להגיש את המוצר כאילו הוא שלכם',
      'תוכנית השותפים של ClawFlow — הכנסה נוספת',
      'Reporting Framework מוכן ללקוחות שלכם'
    ]},
    { id: 'p12', title: 'Case Study חי — פרויקט שהגיע ל-100K משתמשים', duration: '90 דק׳', points: [
      'אני עובר איתכם על פרויקט אמיתי מהעבר — מהרגע הראשון',
      'ההיפותזה הראשונית — ומה התברר',
      'הטעויות של החודש הראשון (היו הרבה)',
      'מה בסוף עבד ולמה',
      'מספרים אמיתיים, גרפים, נתונים — הכל גלוי'
    ]}
  ]

  const faqs = [
    { q: 'זה קורס שיווק?', a: 'לא. זה קורס שמלמד אתכם להשתמש בפלטפורמה שבנינו — שהיא זו שעושה את השיווק בפועל. אתם הופכים למנהלים של צוות 9 סוכני AI מקצועיים שמבצעים את כל העבודה. לא לומדים לכתוב פוסטים בעצמכם — לומדים לאשר את מה שהסוכן כתב, לכוון את הכיוון, ולנהל את הצוות.' },
    { q: 'אנחנו לא אנשים טכניים. באמת נסתדר?', a: 'כן — מסלול בעלי העסקים נבנה בדיוק בשבילכם. לא תכתבו שורת קוד אחת. אם אתם יודעים לשלוח מייל ולגלוש באינטרנט — אתם תסתדרו.' },
    { q: 'האם הקורס כולל גישה ל-ClawFlow?', a: 'לא — הקורס והפלטפורמה הם מוצרים נפרדים. הקורס מלמד אתכם לשלוט ב-ClawFlow. תוכניות הפלטפורמה מתחילות מ-₪79 לחודש, עם 7 ימי ניסיון חינם.' },
    { q: 'איך נראה השיעור הראשון החינמי?', a: 'הוא שיעור מלא, לא טריילר. אחרי שנרשמתם, קישור לפלטפורמת הקורס והשיעור הראשון יגיעו למייל שלכם תוך דקות. תוכלו לצפות בו, לנווט בפלטפורמה, ולראות בדיוק איך נראית חוויית הלמידה לפני שמחליטים לרכוש את המסלול המלא.' },
    { q: 'הקורס כולו מוכן? או שיש שיעורים עתידיים?', a: 'שיעורי המבוא מוכנים. תוכן הקורס מתרחב כל הזמן — בעולם AI שמשתנה חודש-חודש, אין טעם להקפיא גרסה. כבוגרים של המסלול תקבלו את כל העדכונים חינם, לכל החיים.' },
    { q: 'קניתי את מסלול בעלי העסקים ועכשיו אני רוצה את המסלול המקצועי. מה קורה?', a: 'משלמים רק את ההפרש — ₪1,300. לא משלמים פעמיים על תוכן שכבר ראיתם.' },
    { q: 'יש החזר כספי?', a: 'כן — 14 יום לפי חוק הגנת הצרכן. אם זה לא בשבילכם, אנחנו מחזירים בלי שאלות.' },
    { q: 'הקורס בעברית?', a: 'הכל בעברית — וידאו, טקסטים, תרגילים. גם הפלטפורמה עצמה עברית (ויש מעבר לאנגלית בלחיצה). הסוכנים מבינים עברית טבעית ולא מתרגמים מאנגלית.' },
    { q: 'אנחנו סוכנות דיגיטל. יש תנאים מיוחדים?', a: 'המסלול המקצועי כולל מודול שלם על הקמת סוכנות על ClawFlow: Pricing, White-label, Onboarding ללקוח. לסוכנויות גדולות עם צוות — דברו איתנו על רישוי צוותי.' },
    { q: 'כמה זמן ייקח לי לסיים?', a: 'מסלול בעלי עסקים: ~2.5 שעות וידאו, רוב הלומדים מסיימים בסוף שבוע אחד. מסלול מקצועי: 15+ שעות, מומלץ לפרוס על 3-4 שבועות עם תרגול מעשי בין מודולים.' }
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />

      <style>{`
        /* Icon sizing via parent context */
        .hero-badge svg{width:14px;height:14px;color:var(--ink-3);flex-shrink:0;}
        .rz-head-icon svg{width:22px;height:22px;}
        .rz-ico svg{width:20px;height:20px;}
        .youdo-icon svg{width:26px;height:26px;}
        .plan-icon svg{width:24px;height:24px;}
        .mod-head h3 svg{width:22px;height:22px;}
        .wl-pick-btn svg{width:22px;height:22px;}
        .has-price-note svg{width:16px;height:16px;color:var(--accent);vertical-align:-3px;margin-left:4px;}

        .tip{position:relative;cursor:help;border-bottom:1px dashed currentColor;}
        .tip .tip-body{
          visibility:hidden;opacity:0;
          position:absolute;bottom:calc(100% + 6px);right:50%;transform:translateX(50%);
          background:#1C1B18;color:#fff;font-size:0.8rem;font-weight:400;
          padding:10px 14px;border-radius:8px;width:260px;line-height:1.55;
          z-index:200;transition:opacity 0.15s,visibility 0.15s;
          white-space:normal;pointer-events:none;direction:rtl;text-align:right;
          box-shadow:0 10px 30px rgba(0,0,0,0.2);
        }
        .tip .tip-body::after{content:'';position:absolute;top:100%;right:50%;transform:translateX(50%);border:6px solid transparent;border-top-color:#1C1B18;}
        .tip:hover .tip-body{visibility:visible;opacity:1;}
        /* Wide tooltip opens BELOW the anchor (room above is often cut off in hero) */
        .tip-wide .tip-body{
          width:360px;font-size:0.82rem;padding:14px 16px;
          bottom:auto;top:calc(100% + 8px);
          font-weight:400;letter-spacing:normal;
        }
        .tip-wide .tip-body::after{
          top:auto;bottom:100%;
          border-top-color:transparent;border-bottom-color:#1C1B18;
        }

        .kicker-pill{display:inline-flex;align-items:center;gap:8px;background:var(--accent-bg);color:var(--accent);font-size:0.75rem;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;padding:5px 14px;border-radius:20px;margin-bottom:20px;}
        .kicker-pill-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s infinite;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}

        /* ── HERO (centered, airy — compacted for first-screen fit) */
        .hero{padding:56px 0 56px;}
        .hero-centered{max-width:820px;margin:0 auto;text-align:center;display:flex;flex-direction:column;align-items:center;}
        .hero-centered .kicker-pill{margin-bottom:18px;}
        .hero-centered h1{
          font-size:clamp(2.2rem,4.6vw,3.4rem);
          font-weight:900;line-height:1.06;letter-spacing:-2px;
          color:var(--ink);margin-bottom:18px;max-width:820px;
        }
        .hero-centered h1 .line2{display:block;color:var(--accent);margin-top:8px;font-size:0.88em;letter-spacing:-1.4px;font-weight:800;}
        .hero-centered .hero-lead{
          font-size:1.02rem;color:var(--ink-2);line-height:1.7;
          max-width:680px;margin:0 auto 24px;text-align:center;
        }
        .hero-badges{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:24px;}
        .hero-badge{font-size:0.82rem;font-weight:500;color:var(--ink-2);background:#fff;border:1px solid var(--border);padding:6px 14px;border-radius:18px;display:inline-flex;align-items:center;gap:7px;}
        .hero-badge strong{color:var(--accent);font-weight:700;}
        .hero-badge svg{color:var(--ink-3);}
        .hero-stats{
          display:grid;grid-template-columns:repeat(3,1fr);
          gap:1px;background:var(--border);
          border:1px solid var(--border);border-radius:var(--r-lg);
          overflow:hidden;max-width:680px;margin:0 auto;width:100%;
        }
        .hero-stat{background:var(--bg);padding:20px 18px;text-align:center;}
        .hero-stat-num{display:block;font-family:var(--ff);font-size:1.55rem;font-weight:800;color:var(--ink);line-height:1;margin-bottom:6px;letter-spacing:-0.5px;}
        .hero-stat-lbl{font-size:0.8rem;color:var(--ink-3);line-height:1.4;}

        /* ── DEMO section ─────────────────────────── */
        .demo-section{
          padding:72px 0 96px;
          background:linear-gradient(180deg,var(--bg) 0%,var(--bg-2) 100%);
          border-top:1px solid var(--border);border-bottom:1px solid var(--border);
        }
        .demo-frame{max-width:980px;margin:0 auto;position:relative;}
        .demo-frame::before{
          content:'';position:absolute;
          inset:-30px;z-index:0;
          background:radial-gradient(ellipse at center,rgba(212,98,10,0.12),transparent 60%);
          filter:blur(30px);pointer-events:none;
        }
        .video-box{
          position:relative;z-index:1;
          aspect-ratio:16/9;background:var(--ink);
          border-radius:var(--r-lg);overflow:hidden;
          border:1px solid rgba(0,0,0,0.1);cursor:pointer;
          box-shadow:0 30px 80px -20px rgba(0,0,0,0.35),0 12px 30px -10px rgba(212,98,10,0.18);
          transition:transform 0.3s var(--ease),box-shadow 0.3s var(--ease);
        }
        .video-box:hover{transform:translateY(-3px);box-shadow:0 40px 100px -20px rgba(0,0,0,0.4),0 16px 40px -10px rgba(212,98,10,0.25);}
        .video-box::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 30%,rgba(212,98,10,0.3),transparent 55%),radial-gradient(circle at 70% 80%,rgba(37,99,235,0.2),transparent 50%);}
        .video-play{position:absolute;inset:0;display:grid;place-items:center;}
        .video-play-btn{width:92px;height:92px;border-radius:50%;background:#fff;box-shadow:0 20px 60px rgba(0,0,0,0.4);display:grid;place-items:center;transition:transform 0.25s var(--ease);}
        .video-box:hover .video-play-btn{transform:scale(1.08);}
        .video-play-btn svg{width:32px;height:32px;fill:var(--accent);margin-right:5px;}
        .video-label{position:absolute;bottom:20px;right:22px;color:#fff;font-size:0.85rem;font-weight:500;background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);padding:5px 14px;border-radius:16px;z-index:2;}
        .demo-chips{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:28px;}
        .demo-chip{background:#fff;border:1px solid var(--border);border-radius:18px;padding:6px 14px;font-size:0.82rem;color:var(--ink-2);display:inline-flex;align-items:center;gap:6px;}
        .demo-chip svg{width:14px;height:14px;color:var(--accent);}

        /* Combined ROTZIM section */
        .rz-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
        .rz-col{background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;}
        .rz-col.featured{border-color:var(--ink);}
        .rz-head{padding:28px 30px 24px;border-bottom:1px solid var(--border);background:var(--bg-2);}
        .rz-col.featured .rz-head{background:var(--ink);color:#fff;}
        .rz-head-icon{width:40px;height:40px;border-radius:10px;background:var(--accent-bg);color:var(--accent);display:grid;place-items:center;margin-bottom:12px;}
        .rz-col.featured .rz-head-icon{background:rgba(255,255,255,0.1);color:var(--accent-l);}
        .rz-kicker{font-size:0.72rem;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--ink-3);margin-bottom:6px;}
        .rz-col.featured .rz-kicker{color:rgba(255,255,255,0.55);}
        .rz-title{font-size:1.35rem;font-weight:800;color:var(--ink);line-height:1.3;letter-spacing:-0.3px;}
        .rz-col.featured .rz-title{color:#fff;}
        .rz-items{padding:18px 24px 26px;display:flex;flex-direction:column;gap:2px;}
        .rz-item{display:flex;align-items:flex-start;gap:14px;padding:12px 6px;border-bottom:1px dashed var(--border);}
        .rz-item:last-child{border-bottom:none;}
        .rz-ico{flex-shrink:0;width:38px;height:38px;border-radius:10px;background:var(--bg-2);color:var(--accent);display:grid;place-items:center;margin-top:2px;}
        .rz-txt{flex:1;font-size:0.92rem;color:var(--ink-2);line-height:1.55;}
        .rz-txt strong{color:var(--ink);font-weight:600;}
        .rz-agent{font-size:0.73rem;color:var(--ink-3);margin-top:4px;display:block;}

        /* You Do */
        .youdo-inner{background:var(--ink);color:#fff;border-radius:var(--r-lg);padding:48px 40px;}
        .youdo-inner .eyebrow{color:rgba(255,255,255,0.55);}
        .youdo-inner .eyebrow::before{background:rgba(255,255,255,0.3);}
        .youdo-inner h2{color:#fff;margin-bottom:8px;}
        .youdo-sub{color:rgba(255,255,255,0.7);font-size:1rem;line-height:1.7;margin-bottom:32px;}
        .youdo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
        .youdo-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--r);padding:24px 22px;}
        .youdo-icon{width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.06);display:grid;place-items:center;color:var(--accent-l);margin-bottom:12px;}
        .youdo-title{font-size:1rem;font-weight:700;color:#fff;margin-bottom:6px;}
        .youdo-text{font-size:0.85rem;color:rgba(255,255,255,0.7);line-height:1.6;}

        .stack-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
        .stack-item{background:#fff;border:1px solid var(--border);border-radius:var(--r);padding:12px 14px;font-size:0.82rem;color:var(--ink-2);display:flex;align-items:center;gap:8px;}
        .stack-item-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);flex-shrink:0;}
        .stack-item strong{font-weight:600;color:var(--ink);}

        .plans-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:28px;}
        .plan-card{background:#fff;border:2px solid var(--border);border-radius:var(--r-lg);padding:32px 28px;position:relative;transition:all 0.2s;display:flex;flex-direction:column;}
        .plan-card:hover{border-color:var(--border-h);}
        .plan-card.featured{border-color:var(--ink);}
        .plan-featured-tag{position:absolute;top:-12px;right:28px;background:var(--ink);color:#fff;font-size:0.68rem;font-weight:700;letter-spacing:0.6px;padding:4px 12px;border-radius:12px;text-transform:uppercase;}
        .plan-icon{width:44px;height:44px;border-radius:10px;background:var(--accent-bg);color:var(--accent);display:grid;place-items:center;margin-bottom:14px;}
        .plan-card.featured .plan-icon{background:var(--ink);color:var(--accent-l);}
        .plan-name{font-size:0.78rem;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink-3);margin-bottom:6px;}
        .plan-title{font-size:1.35rem;font-weight:800;color:var(--ink);margin-bottom:8px;line-height:1.3;}
        .plan-desc{font-size:0.9rem;color:var(--ink-3);line-height:1.6;margin-bottom:20px;}
        .plan-price{font-size:2.4rem;font-weight:800;color:var(--ink);line-height:1;margin-bottom:4px;}
        .plan-price small{font-size:0.78rem;font-weight:500;color:var(--ink-3);margin-right:4px;}
        .plan-meta{font-size:0.78rem;color:var(--ink-3);margin-bottom:22px;padding-bottom:22px;border-bottom:1px solid var(--border);}
        .plan-wants-label{font-size:0.85rem;font-weight:700;color:var(--accent);margin-bottom:14px;letter-spacing:-0.2px;}
        .plan-card.featured .plan-wants-label{color:var(--accent);}
        .plan-upgrade-note{font-size:0.78rem;color:var(--ink-3);padding:10px 12px;background:var(--bg-2);border-radius:var(--r);margin-bottom:16px;text-align:center;}
        .plan-features{list-style:none;padding:0;margin-bottom:28px;display:flex;flex-direction:column;gap:10px;}
        .plan-features li{font-size:0.87rem;color:var(--ink-2);padding-right:20px;position:relative;line-height:1.55;}
        .plan-features li::before{content:"✓";position:absolute;right:0;color:var(--green);font-weight:700;}
        .plan-cta{display:block;width:100%;padding:13px;background:var(--ink);color:#fff;border-radius:var(--r);font-weight:600;font-size:0.92rem;text-align:center;transition:all 0.18s;margin-top:auto;}
        .plan-cta:hover{background:var(--accent);}
        .plan-cta.outline{background:#fff;color:var(--ink);border:1.5px solid var(--ink);}
        .plan-cta.outline:hover{background:var(--ink);color:#fff;}

        .mod-section{background:var(--bg-2);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:64px 0;}
        .mod-head{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:28px;}
        .mod-head-left{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;}
        .mod-head h3{font-size:1.6rem;font-weight:800;color:var(--ink);letter-spacing:-0.5px;display:flex;align-items:center;gap:10px;}
        .mod-head h3 svg{color:var(--accent);}
        .mod-price-badge{font-size:0.88rem;font-weight:700;color:var(--accent);background:var(--accent-bg);padding:4px 12px;border-radius:14px;}
        .mod-meta{font-size:0.85rem;color:var(--ink-3);}
        .mod-list{display:flex;flex-direction:column;gap:8px;}
        .mod-item{background:#fff;border:1px solid var(--border);border-radius:var(--r);overflow:hidden;transition:border-color 0.18s;}
        .mod-item:hover{border-color:var(--border-h);}
        .mod-item.open{border-color:var(--ink);}
        .mod-btn{width:100%;text-align:right;padding:16px 22px;display:flex;align-items:center;gap:16px;background:transparent;}
        .mod-num{font-family:var(--ff-mono);font-size:0.78rem;color:var(--ink-4);flex-shrink:0;min-width:32px;}
        .mod-title{flex:1;font-size:0.98rem;font-weight:600;color:var(--ink);}
        .mod-dur{font-size:0.78rem;color:var(--ink-3);flex-shrink:0;}
        .mod-caret{width:18px;height:18px;color:var(--ink-3);transition:transform 0.2s;flex-shrink:0;}
        .mod-item.open .mod-caret{transform:rotate(180deg);}
        .mod-body{padding:0 22px 20px;padding-right:72px;display:none;}
        .mod-item.open .mod-body{display:block;}
        .mod-body ul{list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;}
        .mod-body li{font-size:0.88rem;color:var(--ink-2);padding-right:18px;position:relative;line-height:1.6;}
        .mod-body li::before{content:"•";position:absolute;right:0;color:var(--accent);font-weight:700;}

        /* Why-symbolic standalone */
        .why-standalone{max-width:720px;margin:0 auto;text-align:center;background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);padding:44px 40px;}
        .why-quote{font-size:1.15rem;line-height:1.75;color:var(--ink-2);margin-bottom:18px;font-style:italic;}
        .why-cite{font-size:0.9rem;color:var(--ink-3);font-style:normal;display:block;font-weight:500;}

        .about-grid{display:grid;grid-template-columns:200px 1fr;gap:40px;align-items:start;}
        .about-avatar{width:200px;height:200px;border-radius:var(--r-lg);background:var(--bg-3);border:1px solid var(--border);display:grid;place-items:center;font-size:54px;color:var(--ink-3);overflow:hidden;}
        .about-name{font-size:1.3rem;font-weight:700;color:var(--ink);margin-bottom:4px;}
        .about-role{font-size:0.88rem;color:var(--ink-3);margin-bottom:16px;}
        .about-text p{font-size:0.95rem;color:var(--ink-2);line-height:1.75;margin-bottom:12px;}
        .about-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:24px;padding-top:20px;border-top:1px solid var(--border);}
        .about-stat strong{display:block;font-size:1.5rem;font-weight:700;color:var(--ink);line-height:1;margin-bottom:4px;}
        .about-stat span{font-size:0.8rem;color:var(--ink-3);}

        /* Platform link (opens drawer) */
        .platform-btn{
          display:inline;cursor:pointer;border:none;background:none;padding:0;
          font-family:inherit;font-size:inherit;color:inherit;
          border-bottom:2px dashed var(--accent);
          font-weight:700;
          transition:color 0.15s;
        }
        .platform-btn:hover{color:var(--accent);}
        .platform-btn::after{content:' ↗';font-size:0.75em;color:var(--accent);vertical-align:super;opacity:0.8;margin-right:2px;}

        /* Drawer */
        .drawer-wrap{position:fixed;inset:0;z-index:1000;pointer-events:none;}
        .drawer-wrap.open{pointer-events:auto;}
        .drawer-backdrop{
          position:absolute;inset:0;
          background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);
          opacity:0;transition:opacity 0.25s var(--ease);
        }
        .drawer-wrap.open .drawer-backdrop{opacity:1;}
        .drawer{
          position:absolute;top:0;bottom:0;left:0;
          width:480px;max-width:92vw;
          background:#fff;
          transform:translateX(-100%);
          transition:transform 0.3s var(--ease);
          box-shadow:20px 0 60px rgba(0,0,0,0.25);
          overflow-y:auto;
          display:flex;flex-direction:column;
          padding:56px 44px 44px;
        }
        .drawer-wrap.open .drawer{transform:translateX(0);}
        .drawer-close{
          position:absolute;top:18px;left:18px;
          width:36px;height:36px;border-radius:50%;
          background:var(--bg-2);border:none;cursor:pointer;
          display:grid;place-items:center;
          font-size:1.4rem;color:var(--ink-2);
          transition:background 0.15s;
        }
        .drawer-close:hover{background:var(--bg-3);}
        .drawer-kicker{
          display:inline-block;background:var(--accent-bg);color:var(--accent);
          font-size:0.72rem;font-weight:700;letter-spacing:1px;
          text-transform:uppercase;padding:4px 12px;border-radius:12px;margin-bottom:16px;
        }
        .drawer h3{
          font-size:1.7rem;font-weight:800;line-height:1.2;
          letter-spacing:-0.8px;color:var(--ink);margin-bottom:20px;
        }
        .drawer-intro{font-size:1rem;color:var(--ink-2);line-height:1.75;margin-bottom:26px;}
        .drawer-intro strong{color:var(--ink);font-weight:700;}
        .drawer-features{list-style:none;padding:0;display:flex;flex-direction:column;gap:14px;margin-bottom:26px;}
        .drawer-feature{display:flex;align-items:flex-start;gap:14px;}
        .drawer-feature-ico{
          flex-shrink:0;width:36px;height:36px;border-radius:10px;
          background:var(--accent-bg);color:var(--accent);
          display:grid;place-items:center;margin-top:1px;
        }
        .drawer-feature-ico svg{width:18px;height:18px;}
        .drawer-feature-txt{flex:1;font-size:0.92rem;color:var(--ink-2);line-height:1.6;}
        .drawer-feature-txt strong{color:var(--ink);font-weight:600;}
        .drawer-outro{
          background:var(--ink);color:#fff;padding:20px 22px;border-radius:var(--r-lg);
          font-size:0.95rem;line-height:1.65;text-align:center;margin-top:auto;
        }
        .drawer-outro strong{color:var(--accent-l);}

        /* Modal (registration) */
        .modal-wrap{position:fixed;inset:0;z-index:1000;display:none;place-items:center;padding:20px;}
        .modal-wrap.open{display:grid;}
        .modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(3px);animation:fadeIn 0.2s;}
        .modal{
          position:relative;z-index:1;
          background:var(--ink);color:#fff;
          border-radius:var(--r-lg);padding:40px 36px;
          width:100%;max-width:460px;
          animation:modalIn 0.25s var(--ease);
          box-shadow:0 30px 80px rgba(0,0,0,0.4);
        }
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .modal-close{
          position:absolute;top:14px;left:14px;
          width:32px;height:32px;border-radius:50%;
          background:rgba(255,255,255,0.08);border:none;cursor:pointer;color:#fff;
          display:grid;place-items:center;font-size:1.2rem;
          transition:background 0.15s;
        }
        .modal-close:hover{background:rgba(255,255,255,0.15);}
        .modal h3{font-size:1.35rem;font-weight:800;margin-bottom:8px;color:#fff;}
        .modal-sub{font-size:0.9rem;color:rgba(255,255,255,0.7);line-height:1.6;margin-bottom:22px;}
        .modal-track{
          font-size:0.78rem;color:rgba(255,255,255,0.5);margin-bottom:14px;
          padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.1);
        }
        .modal-track strong{color:#fff;font-weight:600;}

        .wl-single-wrap{max-width:560px;margin:0 auto;}

        /* BUY section */
        .buy-section{padding:72px 0 80px;background:linear-gradient(180deg,var(--bg) 0%,var(--bg-2) 100%);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
        .buy-inner{max-width:760px;margin:0 auto;text-align:center;}
        .buy-buttons{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:32px;}
        .buy-btn{
          background:#fff;border:2px solid var(--border);border-radius:var(--r-lg);
          padding:26px 24px;cursor:pointer;transition:all 0.2s var(--ease);
          display:flex;flex-direction:column;align-items:center;gap:10px;
          text-align:center;
        }
        .buy-btn:hover{border-color:var(--ink);transform:translateY(-2px);box-shadow:0 12px 24px -8px rgba(0,0,0,0.15);}
        .buy-btn.featured{background:var(--ink);color:#fff;border-color:var(--ink);}
        .buy-btn.featured:hover{background:#2B2A26;}
        .buy-btn-icon{width:48px;height:48px;border-radius:12px;background:var(--accent-bg);color:var(--accent);display:grid;place-items:center;}
        .buy-btn.featured .buy-btn-icon{background:rgba(255,255,255,0.1);color:var(--accent-l);}
        .buy-btn-icon svg{width:24px;height:24px;}
        .buy-btn-name{font-size:0.78rem;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--ink-3);}
        .buy-btn.featured .buy-btn-name{color:rgba(255,255,255,0.6);}
        .buy-btn-title{font-size:1.05rem;font-weight:700;color:inherit;line-height:1.3;}
        .buy-btn-price{font-size:1.6rem;font-weight:800;color:var(--ink);letter-spacing:-0.5px;line-height:1;margin-top:2px;}
        .buy-btn.featured .buy-btn-price{color:#fff;}
        .buy-btn-cta{font-size:0.82rem;color:var(--accent);font-weight:600;margin-top:4px;}
        .buy-btn.featured .buy-btn-cta{color:var(--accent-l);}
        .buy-trial-link{display:inline-block;margin-top:28px;font-size:0.92rem;color:var(--ink-3);border-bottom:1px dashed currentColor;padding-bottom:2px;cursor:pointer;transition:color 0.15s;background:none;border:none;border-bottom:1px dashed currentColor;font-family:inherit;}
        .buy-trial-link:hover{color:var(--accent);}
        .wl-card{background:var(--ink);color:#fff;border-radius:var(--r-lg);padding:40px 36px;}
        .wl-card .eyebrow{color:rgba(255,255,255,0.55);}
        .wl-card .eyebrow::before{background:rgba(255,255,255,0.3);}
        .wl-card h2{color:#fff;}
        .wl-card p{color:rgba(255,255,255,0.75);font-size:0.95rem;line-height:1.7;margin-bottom:22px;}
        .wl-pick{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:18px;}
        .wl-pick-btn{background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.12);color:#fff;padding:12px 10px;border-radius:var(--r);font-size:0.82rem;font-weight:500;cursor:pointer;transition:all 0.15s;text-align:center;line-height:1.35;display:flex;flex-direction:column;align-items:center;gap:6px;}
        .wl-pick-btn:hover{background:rgba(255,255,255,0.12);}
        .wl-pick-btn.active{background:var(--accent);border-color:var(--accent);}
        .wl-pick-price{display:block;font-size:0.72rem;opacity:0.75;}
        .wl-field{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:var(--r);padding:11px 14px;color:#fff;font-family:var(--ff);font-size:0.9rem;margin-bottom:10px;direction:rtl;}
        .wl-field::placeholder{color:rgba(255,255,255,0.4);}
        .wl-field:focus{outline:none;border-color:var(--accent);background:rgba(255,255,255,0.1);}
        .wl-submit{width:100%;background:var(--accent);color:#fff;font-size:0.95rem;font-weight:600;padding:13px;border-radius:var(--r);border:none;cursor:pointer;transition:all 0.18s;}
        .wl-submit:hover{background:#B8540A;}
        .wl-micro{font-size:0.76rem;color:rgba(255,255,255,0.45);text-align:center;margin-top:12px;}

        .faq-list{border-top:1px solid var(--border);}
        .faq-item{border-bottom:1px solid var(--border);}
        .faq-q{width:100%;text-align:right;padding:18px 0;font-weight:600;font-size:0.98rem;color:var(--ink);display:flex;justify-content:space-between;align-items:center;gap:16px;background:transparent;}
        .faq-q::after{content:"+";font-size:1.3rem;color:var(--ink-3);font-weight:400;transition:transform 0.2s;}
        .faq-item.open .faq-q::after{transform:rotate(45deg);}
        .faq-a{padding:0 0 18px;color:var(--ink-2);font-size:0.92rem;line-height:1.75;display:none;}
        .faq-item.open .faq-a{display:block;}

        @media(max-width:900px){
          .hero{padding:60px 0 52px;}
          .hero-centered h1{font-size:2.1rem;letter-spacing:-1.2px;}
          .hero-centered .hero-lead{font-size:0.98rem;}
          .hero-stats{grid-template-columns:1fr;}
          .demo-section{padding:52px 0 72px;}
          .video-play-btn{width:68px;height:68px;}
          .video-play-btn svg{width:24px;height:24px;}
          .rz-grid{grid-template-columns:1fr;}
          .stack-grid{grid-template-columns:repeat(2,1fr);}
          .plans-grid{grid-template-columns:1fr;}
          .about-grid{grid-template-columns:1fr;}
          .about-avatar{width:120px;height:120px;font-size:38px;}
          .wl-pick{grid-template-columns:1fr;}
          .mod-body{padding-right:22px;}
          .youdo-grid{grid-template-columns:1fr;}
          .youdo-inner{padding:32px 26px;}
        }
        @media(max-width:900px){
          .buy-buttons{grid-template-columns:1fr;}
        }
        @media(max-width:600px){
          .drawer{padding:44px 24px 28px;}
          .drawer h3{font-size:1.4rem;}
          .modal{padding:32px 24px;}
          .plan-card{padding:24px 20px;}
          .wl-card{padding:28px 22px;}
          .why-card{padding:26px 22px;}
          .why-card blockquote{font-size:1rem;}
          .mod-head h3{font-size:1.3rem;}
          .stack-grid{grid-template-columns:1fr 1fr;}
          .about-stats{grid-template-columns:1fr;}
          .tip .tip-body{width:220px;}
          .rz-head{padding:22px 22px 18px;}
          .rz-items{padding:10px 16px 18px;}
        }
      `}</style>

      {/* HERO — centered, airy */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-centered">
            <div className="kicker-pill">
              <span className="kicker-pill-dot"></span>
              לא עוד סתם קורס
            </div>

            <h1>
              שיווק וקידום דיגיטלי עם AI.
              <span className="line2">אתם מנהלים. הסוכנים עובדים.</span>
            </h1>

            <p className="hero-lead">
              ב-8 שנים של שיווק וקידום דיגיטלי, עם ההכשרה של הטובים בתחום, בניתי את מה שתמיד חיפשתי:{' '}
              <button className="platform-btn" onClick={() => setDrawerOpen(true)}>הפלטפורמה המקצועית שלנו</button>{' '}
              שמעסיקה בעבורכם <strong>צוות של 9 מקצועני AI</strong> שמקדמים את העסק שלכם ברמה הגבוהה ביותר. הקורס מלמד אתכם איך לנהל את הצוות — לא איך לעשות שיווק בעצמכם.
            </p>

            <div className="hero-badges">
              <span className="hero-badge"><IStore/> בעלי עסקים — <strong>₪199</strong></span>
              <span className="hero-badge"><IRocket/> משווקים מקצועיים — <strong>₪1,499</strong></span>
              <span className="hero-badge"><IInfinity/> גישה לכל החיים</span>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-num">8 שנים</span>
                <span className="hero-stat-lbl">בשיווק וקידום דיגיטלי</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">1M+</span>
                <span className="hero-stat-lbl">משתמשים אורגניים בפרויקטים</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">9 סוכנים</span>
                <span className="hero-stat-lbl">בנויים ומתואמים לעברית</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO — standalone video section */}
      <section className="demo-section" id="demo">
        <div className="wrap">
          <div className="sh reveal" style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 36px' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>סרטון היכרות</div>
            <h2>כמה מילים על המסלולים</h2>
          </div>
          <div className="demo-frame reveal">
            <div className="video-box" onClick={() => scrollTo('courses')}>
              <div className="video-play">
                <div className="video-play-btn">
                  <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              <div className="video-label">▶ כמה דקות · ייצא בקרוב</div>
            </div>
          </div>
        </div>
      </section>

      {/* STACK GRID WITH TOOLTIPS */}
      <section className="section">
        <div className="wrap">
          <div className="sh reveal">
            <div className="eyebrow">הטכנולוגיה שברקע</div>
            <h2>כל הכלים שמפעילים את המערכת — מוסברים.</h2>
            <p className="sub">אל תפחדו מהשמות. רחפו עם העכבר על כל אחד ותראו הסבר בעברית פשוטה. במסלול בעלי העסקים לא צריכים להתעסק בזה — במסלול המקצועי תשלטו בכולם.</p>
          </div>
          <div className="stack-grid reveal">
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="תוכנת קוד פתוח לסוכני AI — המנוע שלנו. זו התשתית שמאפשרת ליצור סוכנים חכמים שמבצעים משימות."><strong>OpenClaw</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="מודל הבינה המלאכותית של Anthropic — אחד החזקים בעולם. במיוחד טוב בעברית. זה ה'מוח' של הסוכן."><strong>Claude AI</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="מנתב חכם בין מודלי AI שונים. שולח כל משימה למודל הכי מתאים — וחוסך עד 90% בעלויות."><strong>LiteLLM</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="מודל AI שרץ מקומי על השרת שלכם — בלי תלות באינטרנט. טוב למשימות פשוטות ולפרטיות."><strong>Ollama</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="מערכת זיכרון חכמה — הסוכן שולף מהזיכרון שלו רק את המידע הרלוונטי בזמן אמת, ללא צורך לקרוא הכל כל פעם."><strong>Mem0 + Qdrant</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="כלי שסורק אתרי אינטרנט במקומכם — למשל, סריקת אתר מתחרה כדי להבין את האסטרטגיה שלו."><strong>Crawl4AI</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="שירות שמחלץ מידע מאתרים בצורה מסודרת — למשל, רשימת מוצרים או מחירים מאתר של מתחרה."><strong>Firecrawl</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="שירות שנותן נתונים מגוגל — מיקומים, מילות מפתח, כמה אנשים מחפשים מה, ואיך המתחרים מדורגים."><strong>DataForSEO</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="Gmail + Calendar + Drive + Sheets. הסוכן מתחבר לחשבון שלכם וקורא מיילים, קובע פגישות ומנהל קבצים."><strong>Google Workspace</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="מערכת הפרסום הממומן של גוגל. הסוכן מקים ומנהל קמפיינים אוטומטית — קהלי יעד, תקציבים, מודעות."><strong>Google Ads</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="מערכת הפרסום של פייסבוק ואינסטגרם. הסוכן יוצר קמפיינים, יצירתיים ומקדם אותם אוטומטית."><strong>Meta Ads</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="WhatsApp Business — חשבון עסקי של וואטסאפ. מאפשר לשלוח הודעות ללקוחות, ולנהל תשובות אוטומטיות."><strong>WhatsApp Business</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="הפרופיל העסקי שלכם בגוגל מפות ובחיפוש. הסוכן מעלה פוסטים, מגיב לביקורות ומתחזק נוכחות."><strong>Google Business</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="כלי אוטומציות פתוח — מחבר בין אפליקציות ומאפשר ליצור זרימות עבודה מורכבות. כמו Zapier אבל פתוח."><strong>Activepieces</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="מסגרת לניהול צוותי סוכנים מרובים שעובדים ביחד על משימה מורכבת. משתמשים בה למשימות מתקדמות."><strong>CrewAI</strong></Tip></div>
            <div className="stack-item"><span className="stack-item-dot"></span><Tip text="שכבת הגנה שמונעת התקפות על הסוכן — כמו שמישהו ינסה 'להטעות' אותו לעשות משהו לא רצוי."><strong>LLM Guard</strong></Tip></div>
          </div>
        </div>
      </section>

      {/* YOU DO — after stack, before modules */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="youdo-inner reveal">
            <div className="eyebrow">ומה אתם עושים?</div>
            <h2>הרבה פחות ממה שחשבתם.</h2>
            <p className="youdo-sub">
              שיווק מקצועי בלי להיות "עסוקים כל הזמן". הסוכנים עובדים ברקע — אתם קובעים כיוון ומאשרים.
              15 דקות ביום זה כל מה שצריך לשליטה מלאה.
            </p>

            <div className="youdo-grid">
              <div className="youdo-card">
                <div className="youdo-icon"><ICheck/></div>
                <div className="youdo-title">מאשרים</div>
                <div className="youdo-text">הסוכן מכין — אתם מאשרים. תוכן, קמפיינים, מסרים. הכל עובר אישור אנושי לפני פרסום. V או ✕ — זהו.</div>
              </div>
              <div className="youdo-card">
                <div className="youdo-icon"><IBook/></div>
                <div className="youdo-title">קוראים דוחות</div>
                <div className="youdo-text">כל בוקר מחכה לכם <strong>Daily Brief</strong> — סיכום של מה קרה אתמול, מה היום ומה דורש תשומת לב. 5 דקות.</div>
              </div>
              <div className="youdo-card">
                <div className="youdo-icon"><ICompass/></div>
                <div className="youdo-title">מחליטים על הכיוון</div>
                <div className="youdo-text">אתם עדיין הבוסים. הסוכנים מבצעים — אתם קובעים מטרות חודשיות והכיוון הכללי. הם מחכים להוראות שלכם.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES — merged section */}
      <section className="section" id="courses">
        <div className="wrap">
          <div className="sh reveal" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>שני מסלולים · שני קהלים · אותה שליטה</div>
            <h2>בחרו את המסלול שלכם</h2>
            <p className="sub" style={{ margin: '0 auto' }}>
              שני המסלולים הם קורסים מלאים — כל אחד לקהל שלו. בוחרים לפי מי אתם, לא לפי "הרצינות".
            </p>
          </div>

          <div className="plans-grid reveal">
            <div className="plan-card">
              <div className="plan-icon"><IStore/></div>
              <div className="plan-name">בעלי עסקים</div>
              <div className="plan-title">ניהול עצמאי של שיווק AI</div>
              <div className="plan-desc">
                במקום לשלם ₪5,000-15,000 לחודש לסוכנות שעובדת לאט — אתם מנהלים צוות של 9 מקצועני AI שעובדים בשבילכם 24/7.
                הקורס מלמד אתכם איך — צעד-אחר-צעד, בשפה של בן אדם.
              </div>
              <div className="plan-price">₪199<small>חד-פעמי</small></div>
              <div className="plan-meta">~2.5 שעות וידאו · 6 מודולים · גישה לכל החיים</div>

              <div className="plan-wants-label">רוצים לנהל את הצוות ש...</div>
              <ul className="plan-features">
                <li>עושה <strong>מחקר שוק חודשי אוטומטי</strong> — מתחרים, מילות מפתח, טרנדים ישראלים</li>
                <li>בונה לכם <strong>אסטרטגיה שיווקית ולוח תוכן</strong> חודשי</li>
                <li>כותב <strong>פוסטים, מיילים, מודעות וגרפיקות</strong> בקול של המותג שלכם</li>
                <li>מנהל <strong>קמפיינים ממומנים ב-Meta ו-Google</strong> — הקמה, הפעלה, אופטימיזציה</li>
                <li>מוביל <strong>SEO + <Tip text="Answer Engine Optimization — להופיע בתשובות של ChatGPT, Claude, Perplexity כשאנשים שואלים שאלות בתחום שלכם.">AEO</Tip></strong> — גבוה בגוגל ישראל וגם בצ'אטבוטים של AI</li>
                <li>שולח <strong>דוח יומי של 5 דקות</strong> — מה קרה, מה היום, מה חשוב</li>
                <li>מנוהל ב<strong>שגרה יומית של 15 דקות</strong> בלבד</li>
              </ul>
              <button className="plan-cta outline" onClick={() => openTrialFor('owners')}>נסו שיעור ראשון חינם — לוודא שזה מתאים ←</button>
            </div>

            <div className="plan-card featured">
              <span className="plan-featured-tag">הכי מקיף בישראל</span>
              <div className="plan-icon"><IRocket/></div>
              <div className="plan-name">משווקים מקצועיים</div>
              <div className="plan-title">AI Marketing Mastery</div>
              <div className="plan-desc">
                למשווקים, פרילנסרים, סוכנויות — וכל מי שרוצה להפוך למומחה המקצועי ש-SMBs פונים אליו ב-2026.
                הקורס הכי מקיף בישראל לבניית מערכי AI, לכלים הכי חדשים, ולהקמת סוכנות דיגיטלית מבוססת הפלטפורמה.
              </div>
              <div className="plan-price">₪1,499<small>חד-פעמי</small></div>
              <div className="plan-meta">~15 שעות · 12 מודולים · Q&A חודשי · קבוצת טלגרם לבוגרים</div>

              <div className="plan-wants-label">רוצים ל...</div>
              <ul className="plan-features">
                <li>ללמוד את <strong>הכלים הכי חדשים של 2026</strong> ברמת מומחה (Claude, LiteLLM, Mem0, CrewAI)</li>
                <li>לחסוך <strong>עד 90% בעלויות AI</strong> עם ניתוב חכם בין מודלים</li>
                <li>להתאים אישית כל סוכן ללקוח — <strong>USER.md, BRAND.md, Skills מותאמים</strong></li>
                <li>להפעיל <strong>Meta Ads ו-Google Ads דרך API</strong> — לא ממשק, קוד</li>
                <li>להוביל <strong>SEO + <Tip text="Answer Engine Optimization — להופיע בתשובות של ChatGPT, Claude, Perplexity כשאנשים שואלים שאלות בתחום שלכם.">AEO</Tip></strong> מקצועי — גוגל ובצ'אטבוטים של AI</li>
                <li>להקים <strong>סוכנות דיגיטלית על ClawFlow</strong> — Pricing, White-label, תוכנית שותפים</li>
                <li>לראות <strong>Case Study חי</strong> של פרויקט אמיתי שהגיע למעל מיליון משתמשים</li>
              </ul>
              <div className="plan-upgrade-note">שדרגתם ממסלול בעלי העסקים? משלמים רק ₪1,300 הפרש.</div>
              <button className="plan-cta" onClick={() => openTrialFor('pros')}>נסו שיעור ראשון חינם — לוודא שזה מתאים ←</button>
            </div>
          </div>
        </div>
      </section>

      {/* OWNERS MODULES */}
      <section className="mod-section">
        <div className="wrap">
          <div className="mod-head reveal">
            <div className="mod-head-left">
              <h3><IStore/> תוכנית המסלול לבעלי עסקים</h3>
              <span className="mod-price-badge">₪199</span>
            </div>
            <div className="mod-meta">6 מודולים · ~2.5 שעות · hands-on לאורך כל הדרך</div>
          </div>

          <div className="mod-list reveal">
            {ownersModules.map((m, i) => {
              const isOpen = openModule === m.id
              return (
                <div key={m.id} className={`mod-item ${isOpen ? 'open' : ''}`}>
                  <button className="mod-btn" onClick={() => setOpenModule(isOpen ? null : m.id)}>
                    <span className="mod-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mod-title">{m.title}</span>
                    <span className="mod-dur">{m.duration}</span>
                    <svg className="mod-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  <div className="mod-body">
                    <ul>{m.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PROS MODULES */}
      <section className="mod-section" style={{ background: 'var(--bg-3)' }}>
        <div className="wrap">
          <div className="mod-head reveal">
            <div className="mod-head-left">
              <h3><IRocket/> תוכנית המסלול למשווקים מקצועיים</h3>
              <span className="mod-price-badge">₪1,499</span>
            </div>
            <div className="mod-meta">12 מודולים · ~15 שעות · Case Study חי · קבוצת בוגרים</div>
          </div>

          <div className="mod-list reveal">
            {prosModules.map((m, i) => {
              const isOpen = openModule === m.id
              return (
                <div key={m.id} className={`mod-item ${isOpen ? 'open' : ''}`}>
                  <button className="mod-btn" onClick={() => setOpenModule(isOpen ? null : m.id)}>
                    <span className="mod-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mod-title">{m.title}</span>
                    <span className="mod-dur">{m.duration}</span>
                    <svg className="mod-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  <div className="mod-body">
                    <ul>{m.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* WHY SYMBOLIC — standalone compact */}
      <section className="section" id="why">
        <div className="wrap">
          <div className="why-standalone reveal">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>למה המחיר סימבולי</div>
            <h2 style={{ textAlign: 'center', marginBottom: 22 }}>למה ₪199? למה ₪1,499?</h2>
            <blockquote className="why-quote">
              "יכולתי לגבות ₪4,000 על המסלול המקצועי. קורסים פחות מפורטים עולים ככה.
              אבל המטרה שלי אחרת — אני רוצה שכל בעל עסק בישראל יוכל להתחיל. ההכנסות שלי מגיעות מהפלטפורמה,
              לא מהקורס. הקורס הוא הגשר."
            </blockquote>
            <cite className="why-cite">— סרגיי גופמן, מייסד Flowmatic</cite>
          </div>
        </div>
      </section>

      {/* ABOUT SERGEI */}
      <section className="section">
        <div className="wrap">
          <div className="sh reveal">
            <div className="eyebrow">המרצה</div>
            <h2>מי זה בכלל מלמד אתכם?</h2>
          </div>

          <div className="about-grid reveal">
            <div className="about-avatar">סג</div>
            <div className="about-text">
              <div className="about-name">סרגיי גופמן</div>
              <div className="about-role">מייסד Flowmatic · בונה ClawFlow · משווק מ-2017</div>
              <p>
                ההכשרה שלי לא הגיעה מיוטיוב ולא מקורסי אונליין אקראיים. למדתי במוסדות הכשרה
                מקצועיים מובילים בתחום, ובליווי אישי של מנטורים שהיו הטובים ביותר בתחומם
                באותה התקופה. מה שאלמד אתכם בקורס — עברתי, ניסיתי, שיפרתי, וראיתי עובד
                בעסקים אמיתיים.
              </p>
              <p>
                מ-2017 בשיווק דיגיטלי — עבדתי עם עשרות פרויקטים, גם בתור סטודיו וגם באופן עצמאי.
                הובלתי קמפיינים אורגניים שהביאו <strong>מעל מיליון משתמשים</strong> לפרויקטים שלי ושל לקוחות,
                ניהלתי תקציבי פרסום ממומן, עבדתי יד-ביד עם מעצבי UX/UI. ראיתי את המקצוע משני הצדדים.
              </p>
              <p>
                כשה-AI הגיע לחיינו, הבנתי שיש כאן הזדמנות אחרת לגמרי. לא ללמד אנשים שיווק — אלא <strong>לבנות את הצוות ש-SMBs תמיד רצו להעסיק</strong>. ככה נולדה הפלטפורמה שלנו: 9 סוכני AI מקצועיים, מאומנים עמוקות על השוק הישראלי, מוכנים לעבודה. <strong>הקורס הזה לא מלמד אתכם שיווק — הוא מלמד אתכם איך לנהל את הצוות הזה.</strong>
              </p>
              <div className="about-stats">
                <div className="about-stat">
                  <strong>2017</strong>
                  <span>בתחום השיווק</span>
                </div>
                <div className="about-stat">
                  <strong>1M+</strong>
                  <span>משתמשים אורגניים שהובלתי</span>
                </div>
                <div className="about-stat">
                  <strong>9 סוכנים</strong>
                  <span>בנויים ומתואמים לעברית</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BUY CTA — simple final call-to-action */}
      <section className="buy-section" id="buy">
        <div className="wrap">
          <div className="buy-inner reveal">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>מוכנים להתחיל?</div>
            <h2>רכשו את המסלול שלכם</h2>
            <p className="sub" style={{ margin: '14px auto 0' }}>
              תשלום חד-פעמי · גישה לכל החיים · עדכונים עתידיים כלולים.
            </p>

            <div className="buy-buttons">
              <button className="buy-btn" onClick={() => openBuyFor('owners')}>
                <div className="buy-btn-icon"><IStore/></div>
                <span className="buy-btn-name">בעלי עסקים</span>
                <span className="buy-btn-title">ניהול עצמאי של שיווק AI</span>
                <span className="buy-btn-price">₪199</span>
                <span className="buy-btn-cta">רכישה ←</span>
              </button>
              <button className="buy-btn featured" onClick={() => openBuyFor('pros')}>
                <div className="buy-btn-icon"><IRocket/></div>
                <span className="buy-btn-name">משווקים מקצועיים</span>
                <span className="buy-btn-title">AI Marketing Mastery</span>
                <span className="buy-btn-price">₪1,499</span>
                <span className="buy-btn-cta">רכישה ←</span>
              </button>
            </div>

            <button className="buy-trial-link" onClick={() => openTrialFor('owners')}>
              עדיין לא בטוחים? נסו שיעור ראשון חינם →
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="wrap">
          <div className="sh reveal" style={{ maxWidth: 760, margin: '0 auto 32px' }}>
            <div className="eyebrow">שאלות נפוצות</div>
            <h2>כל מה שאתם צריכים לדעת</h2>
          </div>

          <div className="faq-list reveal" style={{ maxWidth: 760, margin: '0 auto' }}>
            {faqs.map((f, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.q}
                </button>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="#buy" className="btn-main" onClick={(e) => { e.preventDefault(); scrollTo('buy') }}>
              רכשו את המסלול ←
            </a>
          </div>
        </div>
      </section>

      {/* ── Platform Drawer ─────────────────────────────── */}
      <div className={`drawer-wrap ${drawerOpen ? 'open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)}></div>
        <aside className="drawer" role="dialog" aria-label="פרטי הפלטפורמה">
          <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="סגור">×</button>
          <div className="drawer-kicker">מה זו בעצם הפלטפורמה שלנו?</div>
          <h3>משהו שלא היה בשוק — אז בנינו מאפס.</h3>
          <p className="drawer-intro">
            לא wrapper על ChatGPT. לא עוד "agent builder" פשוט.
            פלטפורמה מקצועית, עצמאית ושלמה, שנפרשת על שרת פרטי שלכם
            והופכת להיות <strong>הנכס שלכם — לחלוטין</strong>.
          </p>
          <ul className="drawer-features">
            <li className="drawer-feature">
              <div className="drawer-feature-ico"><ILayers/></div>
              <div className="drawer-feature-txt"><strong>נפרשת על VPS פרטי שלכם</strong> — בעלות מלאה על הנתונים ועל המערכת. אתם הבעלים הבלעדיים.</div>
            </li>
            <li className="drawer-feature">
              <div className="drawer-feature-ico"><ICode/></div>
              <div className="drawer-feature-txt"><strong>מבוססת על הכלים הטובים ביותר בקוד פתוח</strong> — בחרנו בקפידה כל רכיב מהטובים שבתחום, כדי שתקבלו את המיטב.</div>
            </li>
            <li className="drawer-feature">
              <div className="drawer-feature-ico"><IBrain/></div>
              <div className="drawer-feature-txt"><strong>מאומנת עמוק על עברית ועל השוק הישראלי</strong> — לא תרגום, לא adaptation. מדברת בעברית טבעית כמו ישראלי.</div>
            </li>
            <li className="drawer-feature">
              <div className="drawer-feature-ico"><ICoins/></div>
              <div className="drawer-feature-txt"><strong>אופטימיזציית Token מתקדמת</strong> — ניתוב חכם בין מודלים שחוסך עד 90% בעלויות ה-AI. אתם לא משלמים מיותר.</div>
            </li>
            <li className="drawer-feature">
              <div className="drawer-feature-ico"><IUsers/></div>
              <div className="drawer-feature-txt"><strong>9 סוכני AI מקצועיים לשיווק וקידום</strong> — מחקר, אסטרטגיה, תוכן, פרסום, אופטימיזציה — מוכנים לעבודה ביום הראשון.</div>
            </li>
          </ul>
          <div className="drawer-outro">
            פשוט — <strong>הדבר הכי טוב</strong> שאפשר לבנות בתחום הזה היום.
          </div>
        </aside>
      </div>

      {/* ── Registration Modal (trial / buy) ─────────── */}
      <div className={`modal-wrap ${modalOpen ? 'open' : ''}`}>
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}></div>
        <div className="modal" role="dialog" aria-label="הרשמה">
          <button className="modal-close" onClick={() => setModalOpen(false)} aria-label="סגור">×</button>
          <h3>
            {modalIntent === 'trial' ? 'שיעור ראשון חינם' : 'בקשת רכישה'}
          </h3>
          <p className="modal-sub">
            {modalIntent === 'trial'
              ? 'הזינו פרטים ותקבלו למייל קישור לפלטפורמת הקורס ולשיעור הראשון המלא. בלי תשלום, בלי כרטיס אשראי.'
              : 'הזינו פרטים ונחזור אליכם עם פרטי רכישה. המחיר קבוע, ללא עלויות נוספות.'}
          </p>
          <div className="modal-track">
            מסלול: <strong>{coursePick === 'owners' ? 'בעלי עסקים — ₪199' : coursePick === 'pros' ? 'משווקים מקצועיים — ₪1,499' : 'שני המסלולים'}</strong>
          </div>
          <input type="text" id="md-name" className="wl-field" placeholder="שם מלא" />
          <input type="email" id="md-email" className="wl-field" placeholder="אימייל" />
          <div id="md-success" style={{ display: 'none', background: 'rgba(42,122,75,0.15)', border: '1px solid rgba(42,122,75,0.4)', borderRadius: 8, padding: 14, textAlign: 'center', color: '#6EE7A7', fontWeight: 600, marginBottom: 10 }}>
            ✓ נרשמתם! {modalIntent === 'trial' ? 'הקישור נשלח למייל שלכם.' : 'ניצור קשר בהקדם.'}
          </div>
          <button className="wl-submit" id="md-submit" onClick={submitModal}>
            {modalIntent === 'trial' ? 'קבלו גישה חינם ←' : 'שלחו בקשת רכישה ←'}
          </button>
          <p className="wl-micro">
            {modalIntent === 'trial' ? 'בלי תשלום · בלי כרטיס אשראי · גישה מיידית למייל' : 'נחזור אליכם תוך 24 שעות'}
          </p>
        </div>
      </div>
    </>
  )
}
