'use client'

import { useEffect, useState, ReactNode } from 'react'

type CoursePick = 'owners' | 'pros' | 'both'

const Tip = ({ children, text }: { children: ReactNode; text: string }) => (
  <span className="tip">
    {children}
    <span className="tip-body">{text}</span>
  </span>
)

export default function Home() {
  const [coursePick, setCoursePick] = useState<CoursePick>('owners')
  const [openModule, setOpenModule] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const pickCourse = (c: CoursePick) => {
    setCoursePick(c)
    setTimeout(() => scrollTo('waitlist'), 50)
  }

  const submitWaitlist = () => {
    const name = (document.getElementById('wl-name') as HTMLInputElement)?.value?.trim()
    const email = (document.getElementById('wl-email') as HTMLInputElement)?.value?.trim()
    const phone = (document.getElementById('wl-phone') as HTMLInputElement)?.value?.trim()
    const role = (document.getElementById('wl-role') as HTMLSelectElement)?.value
    if (!email || !email.includes('@')) { alert('אנא הזינו אימייל תקין'); return }
    if (!name) { alert('אנא מלאו שם'); return }

    const btn = document.getElementById('wl-submit') as HTMLButtonElement
    btn.disabled = true; btn.textContent = 'שולח...'

    const courseLabel = coursePick === 'owners' ? 'המסלול לבעלי עסקים — ₪199'
                      : coursePick === 'pros'   ? 'המסלול למשווקים מקצועיים — ₪1,499'
                      : 'שני המסלולים'
    const roleLabel = role || 'לא צוין'

    const message = `רשימת המתנה לקורס\nמסלול: ${courseLabel}\nתפקיד: ${roleLabel}\nאימייל: ${email}\nטלפון: ${phone || 'לא צוין'}`

    fetch('https://api.clawflow.flowmatic.co.il/hosting/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone: phone || email,
        type: `קורס — ${courseLabel}`,
        message
      })
    }).then(r => r.json()).then(() => {
      document.getElementById('wl-success')!.style.display = ''
      btn.style.display = 'none'

      fetch('https://api.clawflow.flowmatic.co.il/hosting/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      }).catch(() => {})
    }).catch(() => {
      btn.disabled = false; btn.textContent = 'שמרו לי מקום ←'
      alert('שגיאה בשליחה, נסו שוב')
    })
  }

  const courseSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Flowmatic Academy — Business Owners Track',
      description: 'המסלול המלא לבעלי עסקים בישראל: לנהל לבד את כל מחזור השיווק בעזרת סוכני AI, ללא רקע טכני',
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
    { q: 'אנחנו לא אנשים טכניים. באמת נסתדר?', a: 'כן — מסלול בעלי העסקים נבנה בדיוק בשבילכם. לא תכתבו שורת קוד אחת. אם אתם יודעים לשלוח מייל ולגלוש באינטרנט — אתם תסתדרו. נתקעתם? יש HAAS — אני עוזר אישית במחיר הוגן.' },
    { q: 'האם הקורס כולל גישה ל-ClawFlow?', a: 'לא — הקורס והפלטפורמה הם מוצרים נפרדים. הקורס מלמד אתכם לשלוט ב-ClawFlow. תוכניות הפלטפורמה מתחילות מ-₪79 לחודש, עם 7 ימי ניסיון חינם.' },
    { q: 'מתי הקורס יוצא?', a: 'הקורס בכתיבה ממש עכשיו. כל מי שברשימת ההמתנה יקבל הודעה במייל ברגע שהוא יוצא — ויזכה ב-48 שעות קדימות ובהנחת השקה למצטרפים מוקדמים.' },
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
        /* Tooltip system */
        .tip{position:relative;cursor:help;border-bottom:1px dashed currentColor;}
        .tip .tip-body{
          visibility:hidden;opacity:0;
          position:absolute;bottom:calc(100% + 6px);right:50%;
          transform:translateX(50%);
          background:#1C1B18;color:#fff;
          font-size:0.8rem;font-weight:400;
          padding:10px 14px;border-radius:8px;
          width:260px;line-height:1.55;
          z-index:200;
          transition:opacity 0.15s,visibility 0.15s;
          white-space:normal;pointer-events:none;
          direction:rtl;text-align:right;
          box-shadow:0 10px 30px rgba(0,0,0,0.2);
        }
        .tip .tip-body::after{
          content:'';position:absolute;top:100%;right:50%;transform:translateX(50%);
          border:6px solid transparent;border-top-color:#1C1B18;
        }
        .tip:hover .tip-body{visibility:visible;opacity:1;}

        .kicker-pill{display:inline-flex;align-items:center;gap:8px;background:var(--accent-bg);color:var(--accent);font-size:0.75rem;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;padding:5px 14px;border-radius:20px;margin-bottom:20px;}
        .kicker-pill-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s infinite;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}

        .video-box{aspect-ratio:16/9;background:var(--ink);border-radius:var(--r-lg);position:relative;overflow:hidden;border:1px solid var(--border);cursor:pointer;}
        .video-box::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 30%,rgba(212,98,10,0.22),transparent 60%),radial-gradient(circle at 70% 80%,rgba(37,99,235,0.18),transparent 50%);}
        .video-play{position:absolute;inset:0;display:grid;place-items:center;}
        .video-play-btn{width:74px;height:74px;border-radius:50%;background:#fff;box-shadow:0 10px 40px rgba(0,0,0,0.35);display:grid;place-items:center;transition:transform 0.2s;}
        .video-box:hover .video-play-btn{transform:scale(1.08);}
        .video-play-btn svg{width:26px;height:26px;fill:var(--accent);margin-right:4px;}
        .video-label{position:absolute;bottom:18px;right:20px;color:#fff;font-size:0.82rem;font-weight:500;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);padding:4px 12px;border-radius:14px;}

        .audience-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
        .audience-card{background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);padding:28px 26px;}
        .audience-icon{width:44px;height:44px;border-radius:10px;background:var(--accent-bg);color:var(--accent);display:grid;place-items:center;font-size:22px;margin-bottom:14px;}
        .audience-title{font-size:1.15rem;font-weight:700;color:var(--ink);margin-bottom:8px;}
        .audience-desc{font-size:0.9rem;color:var(--ink-3);line-height:1.65;margin-bottom:16px;}
        .audience-list{list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;}
        .audience-list li{font-size:0.87rem;color:var(--ink-2);padding-right:18px;position:relative;}
        .audience-list li::before{content:"✓";position:absolute;right:0;color:var(--green);font-weight:700;}

        /* Agents-do-for-you grid */
        .adfy-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;}
        .adfy-card{background:#fff;padding:28px 24px;}
        .adfy-icon{width:44px;height:44px;border-radius:12px;background:var(--accent-bg);display:grid;place-items:center;font-size:22px;margin-bottom:14px;}
        .adfy-title{font-size:1.05rem;font-weight:700;color:var(--ink);margin-bottom:8px;}
        .adfy-text{font-size:0.88rem;color:var(--ink-2);line-height:1.7;}
        .adfy-text strong{color:var(--ink);font-weight:600;}

        /* You-do section */
        .youdo-inner{background:var(--ink);color:#fff;border-radius:var(--r-lg);padding:48px 40px;}
        .youdo-inner .eyebrow{color:rgba(255,255,255,0.55);}
        .youdo-inner .eyebrow::before{background:rgba(255,255,255,0.3);}
        .youdo-inner h2{color:#fff;margin-bottom:8px;}
        .youdo-sub{color:rgba(255,255,255,0.7);font-size:1rem;line-height:1.7;margin-bottom:32px;}
        .youdo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
        .youdo-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--r);padding:24px 22px;}
        .youdo-icon{font-size:28px;margin-bottom:10px;}
        .youdo-title{font-size:1rem;font-weight:700;color:#fff;margin-bottom:6px;}
        .youdo-text{font-size:0.85rem;color:rgba(255,255,255,0.7);line-height:1.6;}

        /* Israel tuning */
        .il-section{background:#fff;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:60px 0;}
        .il-flag{font-size:2.4rem;margin-bottom:8px;}
        .il-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:32px;}
        .il-item{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r);padding:18px 20px;}
        .il-item-head{display:flex;align-items:center;gap:10px;margin-bottom:6px;}
        .il-item-icon{font-size:18px;}
        .il-item-title{font-size:0.95rem;font-weight:600;color:var(--ink);}
        .il-item-text{font-size:0.83rem;color:var(--ink-3);line-height:1.6;}

        .stack-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
        .stack-item{background:#fff;border:1px solid var(--border);border-radius:var(--r);padding:12px 14px;font-size:0.82rem;color:var(--ink-2);display:flex;align-items:center;gap:8px;}
        .stack-item-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);flex-shrink:0;}
        .stack-item strong{font-weight:600;color:var(--ink);}

        .plans-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:28px;}
        .plan-card{background:#fff;border:2px solid var(--border);border-radius:var(--r-lg);padding:32px 28px;position:relative;transition:all 0.2s;display:flex;flex-direction:column;}
        .plan-card:hover{border-color:var(--border-h);}
        .plan-card.featured{border-color:var(--ink);}
        .plan-featured-tag{position:absolute;top:-12px;right:28px;background:var(--ink);color:#fff;font-size:0.68rem;font-weight:700;letter-spacing:0.6px;padding:4px 12px;border-radius:12px;text-transform:uppercase;}
        .plan-name{font-size:0.78rem;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink-3);margin-bottom:6px;}
        .plan-title{font-size:1.35rem;font-weight:800;color:var(--ink);margin-bottom:8px;line-height:1.3;}
        .plan-desc{font-size:0.9rem;color:var(--ink-3);line-height:1.6;margin-bottom:20px;}
        .plan-price{font-size:2.4rem;font-weight:800;color:var(--ink);line-height:1;margin-bottom:4px;}
        .plan-price small{font-size:0.78rem;font-weight:500;color:var(--ink-3);margin-right:4px;}
        .plan-meta{font-size:0.78rem;color:var(--ink-3);margin-bottom:22px;padding-bottom:22px;border-bottom:1px solid var(--border);}
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
        .mod-head h3{font-size:1.6rem;font-weight:800;color:var(--ink);letter-spacing:-0.5px;}
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

        .why-card{background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);padding:36px 32px;}
        .why-card blockquote{font-size:1.1rem;line-height:1.75;color:var(--ink-2);border-right:3px solid var(--accent);padding-right:18px;margin-bottom:18px;}
        .why-card cite{font-size:0.88rem;color:var(--ink-3);font-style:normal;display:block;}

        .about-grid{display:grid;grid-template-columns:200px 1fr;gap:40px;align-items:start;}
        .about-avatar{width:200px;height:200px;border-radius:var(--r-lg);background:var(--bg-3);border:1px solid var(--border);display:grid;place-items:center;font-size:54px;color:var(--ink-3);overflow:hidden;}
        .about-name{font-size:1.3rem;font-weight:700;color:var(--ink);margin-bottom:4px;}
        .about-role{font-size:0.88rem;color:var(--ink-3);margin-bottom:16px;}
        .about-text p{font-size:0.95rem;color:var(--ink-2);line-height:1.75;margin-bottom:12px;}
        .about-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:24px;padding-top:20px;border-top:1px solid var(--border);}
        .about-stat strong{display:block;font-size:1.5rem;font-weight:700;color:var(--ink);line-height:1;margin-bottom:4px;}
        .about-stat span{font-size:0.8rem;color:var(--ink-3);}

        .wl-card{background:var(--ink);color:#fff;border-radius:var(--r-lg);padding:40px 36px;}
        .wl-card .eyebrow{color:rgba(255,255,255,0.55);}
        .wl-card .eyebrow::before{background:rgba(255,255,255,0.3);}
        .wl-card h2{color:#fff;}
        .wl-card p{color:rgba(255,255,255,0.75);font-size:0.95rem;line-height:1.7;margin-bottom:22px;}
        .wl-pick{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:18px;}
        .wl-pick-btn{background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.12);color:#fff;padding:12px 10px;border-radius:var(--r);font-size:0.82rem;font-weight:500;cursor:pointer;transition:all 0.15s;text-align:center;line-height:1.35;}
        .wl-pick-btn:hover{background:rgba(255,255,255,0.12);}
        .wl-pick-btn.active{background:var(--accent);border-color:var(--accent);}
        .wl-pick-price{display:block;font-size:0.72rem;opacity:0.75;margin-top:2px;}
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

        .hero-course-inner{display:grid;grid-template-columns:1.1fr 1fr;gap:60px;align-items:start;}
        .hero-badges{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px;}
        .hero-badge{font-size:0.78rem;font-weight:500;color:var(--ink-2);background:#fff;border:1px solid var(--border);padding:5px 12px;border-radius:16px;display:inline-flex;align-items:center;gap:6px;}
        .hero-badge strong{color:var(--accent);font-weight:600;}

        @media(max-width:900px){
          .hero-course-inner{grid-template-columns:1fr;gap:32px;}
          .audience-grid{grid-template-columns:1fr;}
          .stack-grid{grid-template-columns:repeat(2,1fr);}
          .plans-grid{grid-template-columns:1fr;}
          .about-grid{grid-template-columns:1fr;}
          .about-avatar{width:120px;height:120px;font-size:38px;}
          .wl-pick{grid-template-columns:1fr;}
          .mod-body{padding-right:22px;}
          .adfy-grid{grid-template-columns:1fr;}
          .youdo-grid{grid-template-columns:1fr;}
          .il-grid{grid-template-columns:1fr 1fr;}
          .youdo-inner{padding:32px 26px;}
        }
        @media(max-width:600px){
          .plan-card{padding:24px 20px;}
          .wl-card{padding:28px 22px;}
          .why-card{padding:26px 22px;}
          .why-card blockquote{font-size:1rem;}
          .mod-head h3{font-size:1.3rem;}
          .stack-grid{grid-template-columns:1fr 1fr;}
          .about-stats{grid-template-columns:1fr;}
          .il-grid{grid-template-columns:1fr;}
          .tip .tip-body{width:220px;}
        }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-course-inner">
            <div>
              <div className="kicker-pill">
                <span className="kicker-pill-dot"></span>
                קורס דיגיטלי חדש · 2026
              </div>
              <h1>
                שיווק דיגיטלי עם AI —<br />
                <span className="accent">אתם מנהלים. הסוכנים עובדים.</span>
              </h1>
              <p className="hero-lead">
                הקורס הראשון בישראל שמלמד אתכם לנהל מחזור שיווק שלם עם סוכני בינה מלאכותית.
                לא תיאוריה, לא מצגות — הדרכה צעד-אחר-צעד על פלטפורמה אמיתית בעברית, מכוונת לגמרי לשוק הישראלי.
              </p>

              <div className="hero-badges">
                <span className="hero-badge">🏪 בעלי עסקים — <strong>₪199</strong></span>
                <span className="hero-badge">🚀 משווקים מקצועיים — <strong>₪1,499</strong></span>
                <span className="hero-badge">♾ גישה לכל החיים</span>
                <span className="hero-badge">🔄 עדכונים חינם</span>
              </div>

              <div className="hero-btns">
                <a href="#courses" className="btn-main" onClick={(e) => { e.preventDefault(); scrollTo('courses') }}>
                  הציגו לי את המסלולים ←
                </a>
                <a href="#waitlist" className="btn-outline" onClick={(e) => { e.preventDefault(); scrollTo('waitlist') }}>
                  הצטרפו לרשימת המתנה
                </a>
              </div>

              <div className="hero-footnote">
                <div className="fn-item">
                  <span className="fn-num">8 שנים</span>
                  בשיווק דיגיטלי
                </div>
                <div className="fn-item">
                  <span className="fn-num">100K+</span>
                  משתמשים בפרויקטים
                </div>
                <div className="fn-item">
                  <span className="fn-num">פלטפורמה</span>
                  אמיתית, שלנו
                </div>
              </div>
            </div>

            <div>
              <div className="video-box" onClick={() => scrollTo('waitlist')}>
                <div className="video-play">
                  <div className="video-play-btn">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
                <div className="video-label">▶ הדגמה · 90 שניות · ייצא בקרוב</div>
              </div>
              <p style={{ marginTop: 14, fontSize: '0.82rem', color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.6 }}>
                סרגיי מציג את הפלטפורמה ומסביר למה זה הקורס הראשון בישראל שמלמד שיווק AI אמיתי — לא תיאוריה.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIENCES */}
      <section className="section" id="who">
        <div className="wrap">
          <div className="sh reveal">
            <div className="eyebrow">למי זה מיועד</div>
            <h2>שני קהלים. שני מסלולים. אותה שליטה מלאה.</h2>
            <p className="sub">שני המסלולים הם קורסים שלמים — כל אחד מותאם למטרה שונה. בוחרים לפי מי אתם, לא לפי "הרצינות".</p>
          </div>

          <div className="audience-grid reveal">
            <div className="audience-card">
              <div className="audience-icon">🏪</div>
              <div className="audience-title">בעלי עסקים (SMB)</div>
              <div className="audience-desc">
                אתם מנהלים עסק ורוצים שהשיווק יעבוד — בלי סוכנויות, בלי פרילנסרים שמחכים שבועיים.
                אין לכם זמן או רצון להתעסק בצד הטכני. אתם רוצים תוצאות ושליטה.
              </div>
              <ul className="audience-list">
                <li>לנהל את כל 9 סוכני השיווק שעובדים בשבילכם</li>
                <li>לאשר תוכן בדקות ולקבל החלטות על סמך דוחות</li>
                <li>לחבר Google, פייסבוק ו-WhatsApp בלי איש טכני</li>
                <li>להבין מה קורה בעסק שלכם — בכל רגע</li>
                <li>לדעת מתי לעבוד לבד ומתי לבקש עזרה אישית</li>
              </ul>
            </div>

            <div className="audience-card">
              <div className="audience-icon">🚀</div>
              <div className="audience-title">משווקים דיגיטליים ומקצועיים</div>
              <div className="audience-desc">
                אתם בתחום, מבינים את המשחק, ורוצים להפוך למומחי AI שכולם פונים אליהם.
                לבנות שירות מבוסס AI — לעצמכם או ללקוחות — ולהקים סוכנות שלמה על הפלטפורמה.
              </div>
              <ul className="audience-list">
                <li>לשלוט במודלי AI ובעלויות ברמת מומחה</li>
                <li>להתאים אישית לכל לקוח את הזהות, הטון והסגנון</li>
                <li>לבנות Skills מותאמים בפייתון או Node</li>
                <li>להפעיל Google Ads ופייסבוק-אדס דרך קוד</li>
                <li>להקים סוכנות שיווק שלמה על ClawFlow</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AGENTS DO FOR YOU */}
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="sh reveal">
            <div className="eyebrow">מה הסוכנים עושים בשבילכם</div>
            <h2>מחזור שיווק שלם — אוטומטי.</h2>
            <p className="sub">המערכת עושה את כל העבודה הקשה. אתם רק מאשרים, קוראים דוחות ומכוונים את הכיוון. זה לא סיסמה — זה איך שהפלטפורמה באמת עובדת.</p>
          </div>

          <div className="adfy-grid reveal">
            <div className="adfy-card">
              <div className="adfy-icon">🔎</div>
              <div className="adfy-title">מחקר שוק רציף</div>
              <div className="adfy-text">
                סוכן <strong>Sayer</strong> סורק את המתחרים שלכם כל שבוע — שינויי מחירים, תכונות חדשות, מסרים שיווקיים.
                סוכן <strong>Meater</strong> בודק כל יום איפה אתם מופיעים ב-<Tip text="מנוע החיפוש של גוגל בישראל — google.co.il. נפרד מהגרסה העולמית, עם תוצאות מותאמות למשתמשים בישראל.">Google ישראל</Tip>.
                סוכן <strong>Maazin</strong> מאזין לפייסבוק, רדיט וקבוצות — ומגלה מה אומרים עליכם.
              </div>
            </div>

            <div className="adfy-card">
              <div className="adfy-icon">🎯</div>
              <div className="adfy-title">אסטרטגיה חודשית</div>
              <div className="adfy-text">
                המערכת מנתחת את כל הנתונים ומכינה לכם <strong>תוכנית פעולה חודשית</strong> — לוח תוכן, תקציבים, סדרי עדיפויות.
                לא קובץ Word במגירה — אלא פעולות ממשיות שאתם מאשרים בקליק והמערכת מבצעת.
              </div>
            </div>

            <div className="adfy-card">
              <div className="adfy-icon">🎨</div>
              <div className="adfy-title">מיתוג ועקביות</div>
              <div className="adfy-text">
                באונבורדינג הסוכן לומד את המותג שלכם ובונה <Tip text="מסמך פנימי שמכיל את הזהות המלאה של המותג שלכם: קול, טון, ערכים, מסרים. כל הסוכנים משתמשים בו כשהם יוצרים תוכן.">BRAND.md</Tip> —
                מסמך פנימי שמנחה את כל הסוכנים לכתוב בקול שלכם.
                סוכן <strong>Mekhayev</strong> מבצע אודיט חודשי ובודק עקביות מותגית.
              </div>
            </div>

            <div className="adfy-card">
              <div className="adfy-icon">✍️</div>
              <div className="adfy-title">יצירת תוכן איכותי</div>
              <div className="adfy-text">
                סוכן <strong>Ayat</strong> כותב מאמרי <Tip text="אופטימיזציה למנועי חיפוש — איך לגרום לאתר שלכם להופיע גבוה בתוצאות הגוגל.">SEO</Tip>, פוסטים לרשתות, מיילים שיווקיים — הכל בטון של המותג שלכם.
                סוכן <strong>Yotzer</strong> יוצר את הויזואלים — תמונות וגרפיקות לפוסטים וקמפיינים.
                אתם רק מאשרים מה יוצא.
              </div>
            </div>

            <div className="adfy-card">
              <div className="adfy-icon">📢</div>
              <div className="adfy-title">פרסום מתוזמן</div>
              <div className="adfy-text">
                סוכן <strong>Shaliach</strong> מפרסם את התוכן המאושר בזמנים הנכונים ובכל ערוץ:
                פייסבוק, אינסטגרם, לינקדאין, טלגרם, בלוג, מייל ו-<Tip text="חשבון עסקי של WhatsApp — מאפשר לשלוח הודעות ללקוחות ברשימות, לנהל תשובות אוטומטיות, ולהפעיל קמפיינים.">WhatsApp Business</Tip>.
                לא שוכח ולא מפספס — כל יום, על פי לוח הזמנים.
              </div>
            </div>

            <div className="adfy-card">
              <div className="adfy-icon">📊</div>
              <div className="adfy-title">אופטימיזציה ודוחות</div>
              <div className="adfy-text">
                המערכת עוקבת אחרי <Tip text="Click-Through Rate — אחוז האנשים שראו משהו ולחצו עליו. מדד מרכזי להצלחת פוסט או מודעה.">CTR</Tip> של כל פוסט, ביצועי קמפיינים, מיקומים בגוגל.
                ממליצה על שינויים מדויקים — מה להגביר, מה לכבות, מה לשנות.
                סוכן <strong>Migdalor</strong> בודק חודשי אם אתם מופיעים ב-<Tip text="צ'אטבוטים של בינה מלאכותית — ChatGPT, Claude, Perplexity, Gemini. אנשים שואלים אותם שאלות ומקבלים תשובות שכוללות מקורות. מטרתנו — שהמותג שלכם יהיה אחד המקורות.">ChatGPT ו-Perplexity</Tip>.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YOU DO */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="youdo-inner reveal">
            <div className="eyebrow">ומה אתם עושים?</div>
            <h2>הרבה פחות ממה שחשבתם.</h2>
            <p className="youdo-sub">
              שיווק מקצועי בלי להיות "עסוקים כל הזמן". הסוכנים עובדים ברקע — אתם קובעים כיוון ומאשרים.
              15 דקות ביום — זה כל מה שצריך כדי לשלוט על הכל.
            </p>

            <div className="youdo-grid">
              <div className="youdo-card">
                <div className="youdo-icon">✅</div>
                <div className="youdo-title">מאשרים</div>
                <div className="youdo-text">
                  הסוכן מכין — אתם מאשרים. תוכן, קמפיינים, מסרים.
                  הכל עובר אישור אנושי לפני פרסום. לחצו V או ✕ — זהו.
                </div>
              </div>
              <div className="youdo-card">
                <div className="youdo-icon">📖</div>
                <div className="youdo-title">קוראים דוחות</div>
                <div className="youdo-text">
                  כל בוקר מחכה לכם <strong>Daily Brief</strong> — סיכום של מה קרה אתמול,
                  מה היום ומה דורש תשומת לב. 5 דקות של קריאה, לא יותר.
                </div>
              </div>
              <div className="youdo-card">
                <div className="youdo-icon">🎯</div>
                <div className="youdo-title">מחליטים על הכיוון</div>
                <div className="youdo-text">
                  אתם עדיין הבוסים. הסוכנים מבצעים — אתם קובעים מטרות חודשיות והכיוון הכללי.
                  הם מחכים להוראות שלכם, לא להיפך.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ISRAEL TUNING */}
      <section className="il-section">
        <div className="wrap">
          <div className="sh reveal" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 20px' }}>
            <div className="il-flag">🇮🇱</div>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>מכוון ב-100% לשוק הישראלי</div>
            <h2>זה לא תרגום. זו לא "גרסה ישראלית" של כלי אמריקאי.</h2>
            <p className="sub" style={{ margin: '0 auto' }}>
              כל פיסת הכיוונון של המערכת נעשתה מהיום הראשון מתוך הבנה עמוקה של השוק הישראלי, השפה והתרבות.
              כל הסוכנים חושבים בעברית — לא מתרגמים מאנגלית.
            </p>
          </div>

          <div className="il-grid reveal">
            <div className="il-item">
              <div className="il-item-head">
                <span className="il-item-icon">🗣</span>
                <span className="il-item-title">עברית טבעית, לא מתורגמת</span>
              </div>
              <div className="il-item-text">הסוכנים כותבים עברית כמו בן-אדם, עם סלנג ישראלי, ביטויים מקומיים, והבנה תרבותית — לא תרגום-גוגל.</div>
            </div>
            <div className="il-item">
              <div className="il-item-head">
                <span className="il-item-icon">📍</span>
                <span className="il-item-title">מתחרים ישראלים בלבד</span>
              </div>
              <div className="il-item-text">המערכת מזהה ומנתחת את המתחרים שלכם בישראל — לא חברות אמריקאיות שלא רלוונטיות לקהל שלכם.</div>
            </div>
            <div className="il-item">
              <div className="il-item-head">
                <span className="il-item-icon">🔎</span>
                <span className="il-item-title">SEO ל-Google.co.il</span>
              </div>
              <div className="il-item-text">האופטימיזציה מכוונת לגוגל ישראל, לא לגוגל עולמי. משלב תוצאות שונות, דפי תוצאות שונים, תחרות שונה.</div>
            </div>
            <div className="il-item">
              <div className="il-item-head">
                <span className="il-item-icon">🕍</span>
                <span className="il-item-title">חגים ומועדים</span>
              </div>
              <div className="il-item-text">לוחות הקמפיינים ממוזגים אוטומטית עם חגי ישראל, שישי-שבת, בין הזמנים — הסוכן מבין את השנה העברית.</div>
            </div>
            <div className="il-item">
              <div className="il-item-head">
                <span className="il-item-icon">💰</span>
                <span className="il-item-title">שקלים, לא דולרים</span>
              </div>
              <div className="il-item-text">כל הדוחות, התקציבים וחישובי ה-ROAS — בשקלים. אין פה המרות טרחניות או עלויות מוסתרות במטבע זר.</div>
            </div>
            <div className="il-item">
              <div className="il-item-head">
                <span className="il-item-icon">📱</span>
                <span className="il-item-title">WhatsApp ישראלי</span>
              </div>
              <div className="il-item-text">חיבור ל-WhatsApp Business דרך ספק ישראלי (Green API) — מאושר על ידי מטא, פועל עם מספרים ישראלים בלי בעיות.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM INSIDE */}
      <div className="phil-strip">
        <div className="wrap">
          <div className="phil-inner">
            <div className="phil-label">
              מה יש בפנים?<br/><em>פלטפורמה אמיתית.</em>
            </div>
            <div className="phil-items">
              <div className="phil-item">
                <div className="phil-num">01</div>
                <div className="phil-title">9 סוכני MATEH מוכנים לעבודה</div>
                <div className="phil-desc">צוות של 9 סוכני AI שכל אחד מתמחה בתחום — מחקר, כתיבה, עיצוב, פרסום, אופטימיזציה. עובדים יחד, כמו צוות שיווק אמיתי — בלי ארוחות צהריים ובלי חופשות.</div>
              </div>
              <div className="phil-item">
                <div className="phil-num">02</div>
                <div className="phil-title">תזמור חכם של מודלי AI</div>
                <div className="phil-desc">המערכת בוחרת אוטומטית את המודל המתאים לכל משימה (Claude של Anthropic, GPT של OpenAI, או מודל מקומי) — כך שתקבלו את האיכות הטובה ביותר במחיר הנמוך ביותר.</div>
              </div>
              <div className="phil-item">
                <div className="phil-num">03</div>
                <div className="phil-title">זיכרון ומחקר אמיתיים</div>
                <div className="phil-desc">הסוכן זוכר הכל על העסק שלכם, לומד מכל שיחה, סורק אתרי מתחרים, ומוציא נתונים אמיתיים מגוגל. לא שוכח כלום, לא ממציא.</div>
              </div>
              <div className="phil-item">
                <div className="phil-num">04</div>
                <div className="phil-title">הכל מחובר — ערוצים ופרסום</div>
                <div className="phil-desc">Gmail, Calendar, Drive, פייסבוק, אינסטגרם, WhatsApp Business, Google Ads, Google Business Profile — הכל מחובר למקום אחד. לא צריך Zapier.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STACK GRID WITH TOOLTIPS */}
      <section className="section">
        <div className="wrap">
          <div className="sh reveal">
            <div className="eyebrow">הטכנולוגיה שברקע</div>
            <h2>כל הכלים שמפעילים את המערכת — מוסברים.</h2>
            <p className="sub">אל תפחדו מהשמות. רחפו עם העכבר על כל אחד ותראו הסבר בעברית פשוטה. במסלול בעלי העסקים — אתם לא צריכים להתעסק בזה. במסלול המקצועי — תשלטו בכולם.</p>
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

      {/* COURSES */}
      <section className="section" id="courses">
        <div className="wrap">
          <div className="sh reveal">
            <div className="eyebrow">המסלולים</div>
            <h2>בחרו את המסלול שמתאים לכם</h2>
            <p className="sub">שני המסלולים הם קורסים מלאים — כל אחד לקהל אחר. המחיר מאפשר לכל אחד להתחיל, בלי גישה יקרה ומיושנת.</p>
          </div>

          <div className="plans-grid reveal">
            {/* Business Owners Track */}
            <div className="plan-card">
              <div className="plan-name">🏪 בעלי עסקים</div>
              <div className="plan-title">ניהול עצמאי של שיווק AI</div>
              <div className="plan-desc">הקורס המלא לבעלי עסקים — לשלוט בכל מחזור השיווק שלכם לבד, עם 9 סוכני AI שעובדים בשבילכם. בלי צוות, בלי סוכנות, בלי כאבי ראש.</div>
              <div className="plan-price">₪199<small>חד-פעמי</small></div>
              <div className="plan-meta">~2.5 שעות וידאו · 6 מודולים מלאים · גישה לכל החיים · עדכונים חינם</div>
              <ul className="plan-features">
                <li>הקמה מלאה של הפלטפורמה בלי רקע טכני</li>
                <li>ניהול כל 9 סוכני השיווק בשפה פשוטה</li>
                <li>חיבור כל הערוצים (Google, פייסבוק, אינסטגרם, WhatsApp)</li>
                <li>קריאת דוחות יומיים וקבלת החלטות מבוססות נתונים</li>
                <li>שגרה יומית של 15 דקות לכל השליטה</li>
                <li>הכל בעברית, מותאם לישראל, בשפה של בן אדם</li>
              </ul>
              <button className="plan-cta outline" onClick={() => pickCourse('owners')}>שמרו לי מקום במסלול הזה ←</button>
            </div>

            {/* Marketing Pros Track */}
            <div className="plan-card featured">
              <span className="plan-featured-tag">הכי מקיף בישראל</span>
              <div className="plan-name">🚀 משווקים מקצועיים</div>
              <div className="plan-title">AI Marketing Mastery</div>
              <div className="plan-desc">הקורס המתקדם למשווקים, פרילנסרים וסוכנויות — לבנות מערכי שיווק מבוססי AI לעצמכם וללקוחות, ולהקים סוכנות דיגיטלית שלמה על הפלטפורמה.</div>
              <div className="plan-price">₪1,499<small>חד-פעמי</small></div>
              <div className="plan-meta">~15 שעות וידאו · 12 מודולים · גישה לכל החיים · עדכונים חינם · Q&A חודשי</div>
              <ul className="plan-features">
                <li>ארכיטקטורת הפלטפורמה מ-A עד ת׳</li>
                <li>אסטרטגיית מודלים וחיסכון של 90% בעלויות AI</li>
                <li>התאמה אישית: USER.md, BRAND.md, Skills מותאמים</li>
                <li>Google Ads ופייסבוק-אדס דרך קוד (API)</li>
                <li>SEO + AEO Mastery — להופיע בגוגל וב-ChatGPT</li>
                <li>הקמת סוכנות דיגיטלית על ClawFlow</li>
                <li>Case Study חי: פרויקט שהגיע ל-100K משתמשים</li>
                <li>קבוצת טלגרם סגורה לבוגרים</li>
                <li>שדרגתם ממסלול בעלי העסקים? משלמים רק ₪1,300 הפרש</li>
              </ul>
              <button className="plan-cta" onClick={() => pickCourse('pros')}>שמרו לי מקום במסלול הזה ←</button>
            </div>
          </div>
        </div>
      </section>

      {/* OWNERS MODULES */}
      <section className="mod-section">
        <div className="wrap">
          <div className="mod-head reveal">
            <div className="mod-head-left">
              <h3>🏪 תוכנית המסלול לבעלי עסקים</h3>
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
              <h3>🚀 תוכנית המסלול למשווקים מקצועיים</h3>
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

      {/* NON-TECHNICAL */}
      <section className="section">
        <div className="wrap">
          <div className="sh reveal" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 44px' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>ללא רקע טכני</div>
            <h2>אם אתם יודעים לשלוח מייל — אתם תסתדרו.</h2>
            <p className="sub" style={{ margin: '0 auto' }}>
              מסלול בעלי העסקים נבנה במיוחד לאדם שמעולם לא נגע בקוד. לא תצטרכו לכתוב prompts מתקדמים. לא תיגעו ב-API.
              רק ממשק נקי, הסברים בעברית, ומישהו שמדריך אתכם צעד-אחר-צעד.
            </p>
          </div>

          <div className="audience-grid reveal">
            <div className="audience-card">
              <div className="audience-icon">✋</div>
              <div className="audience-title">0 שורות קוד</div>
              <div className="audience-desc">כל המודולים של מסלול בעלי העסקים — נקודה ולחיצה בלבד. לא נפתחת שורת פקודה. לא מתקינים דבר על המחשב שלכם.</div>
            </div>
            <div className="audience-card">
              <div className="audience-icon">🎯</div>
              <div className="audience-title">שגרה של 15 דקות ביום</div>
              <div className="audience-desc">אחרי ההקמה הראשונית, העבודה היומית פשוטה: בודקים התראות, מאשרים תוכן, קוראים סיכום. ולחזור לניהול העסק.</div>
            </div>
          </div>
        </div>
      </section>

      {/* HAAS + WHY SYMBOLIC */}
      <section className="has-section" id="has">
        <div className="wrap">
          <div className="has-inner">
            <div className="has-text reveal">
              <div className="eyebrow">נתקעתם? יש בן אדם</div>
              <h2>אף אחד לא נשאר לבד — Human as a Service</h2>
              <p>
                זה הכי גדול. אנחנו לא מוכרים לכם קורס ונעלמים. אם תתקעו בהקמה,
                באינטגרציה עם Google, או בבעיה עם סוכן — תשלחו לי הודעה. אני עונה אישית.
              </p>
              <p>
                בלי מנוי חודשי. בלי מחירון נוקשה. לפי מקרה — ותמיד הוגן.
                לבוגרי המסלול המקצועי — תעריף מוזל, תור קצר ותמיכה עדיפה בקבוצת הטלגרם הסגורה.
              </p>
              <div className="has-price-note">
                💡 <strong>בוגרי הקורס</strong> — תעריף מיוחד ותור מהיר
              </div>
              <div className="has-steps">
                <div className="has-step">
                  <div className="has-step-num">1</div>
                  <div className="has-step-text"><strong>שולחים הודעה</strong> — מספרים מה הבעיה, מה ניסיתם</div>
                </div>
                <div className="has-step">
                  <div className="has-step-num">2</div>
                  <div className="has-step-text"><strong>מקבלים הצעה</strong> — היקף, זמן ועלות הוגנת</div>
                </div>
                <div className="has-step">
                  <div className="has-step-num">3</div>
                  <div className="has-step-text"><strong>מחליטים</strong> — אפס לחץ, אפס התחייבות</div>
                </div>
              </div>
            </div>

            <div className="why-card reveal">
              <div className="eyebrow">למה סימבולי</div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 16 }}>למה ₪199? למה ₪1,499?</h2>
              <blockquote>
                "יכולתי לגבות ₪4,000 על המסלול המקצועי. קורסים פחות מפורטים עולים ככה.
                אבל המטרה שלי אחרת — אני רוצה שכל בעל עסק בישראל יוכל להתחיל. הכסף שלי מגיע מהפלטפורמה,
                לא מהקורס. הקורס הוא הגשר."
              </blockquote>
              <cite>— סרגיי גופמן, מייסד Flowmatic</cite>
              <p style={{ fontSize: '0.87rem', color: 'var(--ink-3)', marginTop: 18, lineHeight: 1.7 }}>
                ₪199 זה חופן ארוחות. ₪1,499 זה פחות מיום עבודה של פרילנסר שיעשה לכם חצי עבודה.
                מה שתרוויחו מהקורס — יחזור אליכם בשורה התחתונה של העסק, לא לכיס שלי.
              </p>
            </div>
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
                מ-2017 בשיווק דיגיטלי — עבדתי עם עשרות פרויקטים, גם בתור סטודיו וגם באופן עצמאי.
                הובלתי קמפיינים אורגניים למעל 100,000 משתמשים, ניהלתי תקציבי פרסום ממומן,
                עבדתי יד-ביד עם מעצבי UX/UI. ראיתי את המקצוע משני הצדדים.
              </p>
              <p>
                כשה-AI הגיע לחיינו, הבנתי שמגיע משהו הרבה יותר גדול מ"כתבו לי מייל ב-ChatGPT".
                בניתי את ClawFlow — פלטפורמה שמאפשרת לכל אחד לנהל מחזור שיווק שלם
                בעצמו. הקורס הזה הוא מה שהייתי רוצה לקבל לפני 8 שנים.
              </p>
              <div className="about-stats">
                <div className="about-stat">
                  <strong>2017</strong>
                  <span>בתחום השיווק</span>
                </div>
                <div className="about-stat">
                  <strong>100K+</strong>
                  <span>משתמשים בפרויקטים</span>
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

      {/* WAITLIST */}
      <section className="has-section" id="waitlist">
        <div className="wrap">
          <div className="has-inner">
            <div className="has-text reveal">
              <div className="eyebrow">רשימת המתנה</div>
              <h2>הקורס בכתיבה. הצטרפו לרשימה — תהיו ראשונים להיכנס.</h2>
              <p>
                אני כותב את הקורס עכשיו — מודול אחרי מודול, סרטון אחרי סרטון.
                בגלל שעולם ה-AI משתנה כל חודש, אני לא רוצה להוציא משהו חצי מבושל.
              </p>
              <p>
                <strong>מה מקבלים מצטרפים מוקדמים:</strong>
              </p>
              <div className="has-steps">
                <div className="has-step">
                  <div className="has-step-num">1</div>
                  <div className="has-step-text"><strong>התראה מוקדמת</strong> — 48 שעות לפני שהקורס יוצא לקהל הרחב</div>
                </div>
                <div className="has-step">
                  <div className="has-step-num">2</div>
                  <div className="has-step-text"><strong>הנחת השקה</strong> — בפעם הראשונה שהקורס עולה, למצטרפים מוקדם בלבד</div>
                </div>
                <div className="has-step">
                  <div className="has-step-num">3</div>
                  <div className="has-step-text"><strong>עדכונים שקופים</strong> — נעדכן אתכם לאורך הדרך באיזה שלב אנחנו, מה כבר מוכן</div>
                </div>
                <div className="has-step">
                  <div className="has-step-num">4</div>
                  <div className="has-step-text"><strong>השפעה על התוכן</strong> — נשאל אתכם מה הכי חשוב ללמד ראשון</div>
                </div>
              </div>
            </div>

            <div className="wl-card reveal">
              <div className="eyebrow">הצטרפות לרשימת המתנה</div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 10 }}>שמרו לי מקום</h2>
              <p>בחרו את המסלול שמתאים לכם. אנחנו נשלח עדכון כשיוצא — בלי ספאם, הבטחה.</p>

              <div className="wl-pick">
                <button className={`wl-pick-btn ${coursePick === 'owners' ? 'active' : ''}`} onClick={() => setCoursePick('owners')}>
                  🏪 בעלי עסקים
                  <span className="wl-pick-price">₪199</span>
                </button>
                <button className={`wl-pick-btn ${coursePick === 'pros' ? 'active' : ''}`} onClick={() => setCoursePick('pros')}>
                  🚀 משווקים מקצועיים
                  <span className="wl-pick-price">₪1,499</span>
                </button>
                <button className={`wl-pick-btn ${coursePick === 'both' ? 'active' : ''}`} onClick={() => setCoursePick('both')}>
                  ⚡ שניהם
                  <span className="wl-pick-price">שדרוג ב-₪1,300</span>
                </button>
              </div>

              <input type="text" id="wl-name" className="wl-field" placeholder="שם מלא" />
              <input type="email" id="wl-email" className="wl-field" placeholder="אימייל" />
              <input type="tel" id="wl-phone" className="wl-field" placeholder="טלפון (לא חובה)" dir="ltr" />
              <select id="wl-role" className="wl-field" defaultValue="">
                <option value="">מה התפקיד שלכם? (לא חובה)</option>
                <option value="בעל/ת עסק">בעל/ת עסק</option>
                <option value="משווק/ת דיגיטלי/ת">משווק/ת דיגיטלי/ת</option>
                <option value="פרילנסר/ית">פרילנסר/ית</option>
                <option value="סוכנות דיגיטל">סוכנות דיגיטל</option>
                <option value="אחר">אחר</option>
              </select>

              <div id="wl-success" style={{ display: 'none', background: 'rgba(42,122,75,0.15)', border: '1px solid rgba(42,122,75,0.4)', borderRadius: 8, padding: 14, textAlign: 'center', color: '#6EE7A7', fontWeight: 600, marginBottom: 10 }}>
                ✅ נרשמתם! תקבלו הודעה במייל ברגע שהקורס מוכן.
              </div>
              <button className="wl-submit" id="wl-submit" onClick={submitWaitlist}>שמרו לי מקום ←</button>
              <p className="wl-micro">בלי ספאם · ביטול בכל עת · עדיפות למצטרפים מוקדם</p>
            </div>
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
            <p style={{ color: 'var(--ink-3)', fontSize: '0.92rem', marginBottom: 16 }}>
              עדיין יש שאלות? <a href="/about" style={{ color: 'var(--accent)', fontWeight: 500 }}>קראו על פלומטיק</a> או שלחו לנו הודעה.
            </p>
            <a href="#waitlist" className="btn-main" onClick={(e) => { e.preventDefault(); scrollTo('waitlist') }}>
              הצטרפו לרשימת המתנה ←
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
