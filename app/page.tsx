'use client'

import { useEffect, useState } from 'react'

type CoursePick = 'basic' | 'advanced' | 'both'

export default function Home() {
  const [coursePick, setCoursePick] = useState<CoursePick>('basic')
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
    if (!email || !email.includes('@')) { alert('נא להזין אימייל תקין'); return }
    if (!name) { alert('נא למלא שם'); return }

    const btn = document.getElementById('wl-submit') as HTMLButtonElement
    btn.disabled = true; btn.textContent = 'שולח...'

    const courseLabel = coursePick === 'basic' ? 'בסיסי — ₪199'
                      : coursePick === 'advanced' ? 'מתקדם — ₪1,499'
                      : 'שני הקורסים'
    const roleLabel = role || 'לא צוין'

    const message = `רשימת המתנה לקורס\nקורס: ${courseLabel}\nתפקיד: ${roleLabel}\nאימייל: ${email}\nטלפון: ${phone || 'לא צוין'}`

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
      btn.disabled = false; btn.textContent = 'שמור את מקומי ←'
      alert('שגיאה בשליחה, נסו שוב')
    })
  }

  const courseSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Flowmatic Academy — Basic',
      description: 'קורס בסיסי לבעלי עסקים: לשלוט בפלטפורמת ClawFlow ובסוכני AI שיווק ללא רקע טכני',
      provider: { '@type': 'Organization', name: 'Flowmatic', url: 'https://flowmatic.co.il' },
      offers: { '@type': 'Offer', price: '199', priceCurrency: 'ILS' }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Flowmatic Academy — Advanced',
      description: 'קורס מתקדם למשווקים דיגיטליים: לבנות מערכי שיווק AI עבור עסקים ולקוחות עם ClawFlow',
      provider: { '@type': 'Organization', name: 'Flowmatic', url: 'https://flowmatic.co.il' },
      offers: { '@type': 'Offer', price: '1499', priceCurrency: 'ILS' }
    }
  ]

  const basicModules = [
    { id: 'b1', title: 'התחלה תוך 10 דקות', duration: '15 דק׳', points: ['מה זה סוכן AI — בשפה פשוטה, בלי מושגים טכניים', 'מה ההבדל בין ClawFlow ל-ChatGPT/Claude', 'בחירת תוכנית בקונפיגורטור — איך לא להתבלבל ולא לשלם יותר מדי', 'הרשמה, קוד חד-פעמי, הפעלת 2FA', 'כניסה ראשונה לדשבורד — הסיבוב הראשון'] },
    { id: 'b2', title: 'אונבורדינג: 5 שאלות ששינו הכל', duration: '25 דק׳', points: ['איך VPS עולה תוך 3 דקות (להסתכל על המסך — בלי לפחד)', 'חיבור Claude API — מאיפה משיגים מפתח וכמה זה עולה בפועל', 'יצירת בוט טלגרם דרך @BotFather — צעד-אחר-צעד', 'MATEH Research Wizard — 11 שאלות שבונות סוכן שיווק מותאם', 'מה Claude עושה כשהוא מנתח את העסק שלך', 'Daily Brief — באיזו שעה לקבל סיכום שיווקי יומי'] },
    { id: 'b3', title: 'דשבורד לאדם לא-טכני', duration: '30 דק׳', points: ['ניווט בלשוניות: Home · Chat · Agents · Integrations · Settings', 'תור האישורים (Approval Queue) — המסך היומי הכי חשוב שלך', 'Content Calendar — מה ייצא ומתי', 'צ׳אט עם הסוכן — איך נותנים משימות נכון', 'החלפה בין סוכנים (OpenClaw · MATEH · BARE)', 'שימוש במובייל — מה עובד ומה לא'] },
    { id: 'b4', title: 'אינטגרציות תוך 30 דקות', duration: '40 דק׳', points: ['Google Workspace — Gmail, Calendar, Sheets, Drive', 'Google Search Console — למעקב SEO', 'Facebook + Instagram דרך Meta OAuth', 'WhatsApp Business דרך Green API', 'Google Business Profile — פוסטים וניהול ביקורות', 'Google Ads — חיבור בסיסי'] },
    { id: 'b5', title: '9 סוכני MATEH בשפה פשוטה', duration: '30 דק׳', points: ['Sayer — מעקב מתחרים שבועי', 'Meater — ניטור מיקומים יומי ב-Google.co.il', 'Maazin — הקשבה חברתית וניתוח סנטימנט', 'Menateach — סיכום שיווקי יומי עם סדר עדיפויות', 'Ayat — ניסוח תוכן פעמיים בשבוע', 'Yotzer — יצירת ויזואלים שבועית', 'Shaliach — פרסום יומי ומעקב CTR', 'Migdalor — ביקורת AEO חודשית (האם מופיעים ב-ChatGPT/Claude)', 'Mekhayev — עיצוב מותג לפי דרישה'] },
    { id: 'b6', title: 'שגרה יומית + מתי לבקש עזרה', duration: '20 דק׳', points: ['15 דקות בבוקר: מה לבדוק', 'איך לתת feedback נכון לסוכן (Memory)', 'מה לעשות כשהתוצאה לא טובה — ואיך לתקן לבד', 'HAAS — מתי לשלם לעזרה וממה להימנע', 'צ׳ק-ליסט של השבוע הראשון — בונוס'] }
  ]

  const advModules = [
    { id: 'a1', title: 'ארכיטקטורה — Deep Dive', duration: '60 דק׳', points: ['OpenClaw מול LangChain/CrewAI — למה בחרנו ככה', 'Cloud-init — איך VPS מוגדר תחת המכסה', 'Hetzner / DigitalOcean / Vultr — מטריצת בחירה', 'Docker, nginx, Caddy, SSL אוטומטי', 'תקציב RAM ו-swap — למה 4GB מספיקים'] },
    { id: 'a2', title: 'אסטרטגיית מודלים (LiteLLM Gateway)', duration: '60 דק׳', points: ['Claude Haiku / Sonnet / Opus — מתי איזה', 'אופטימיזציית עלות: $2 במקום $200 לאותה תוצאה', 'LiteLLM Gateway — caching, rate limiting, observability', 'Ollama local — מתי יש בזה היגיון ומתי לא', 'OpenAI כ-fallback ו-multi-provider routing'] },
    { id: 'a3', title: 'USER.md + BRAND.md + Skills', duration: '90 דק׳', points: ['אנטומיית USER.md — זיכרון הסוכן על העסק', 'BRAND.md — קול, טון, Entity Consensus', 'יצירת Skills מותאמים (Python + Node)', 'ClawHub Marketplace — מה כבר קיים', 'Live — עריכת קבצים ב-File Editor של הפלטפורמה'] },
    { id: 'a4', title: '9 סוכני MATEH תחת המכסה', duration: '120 דק׳', points: ['Sayer — בחירת מודל, cron, inputs, outputs, prompts', 'Meater — SERP tracking דרך DataForSEO', 'Maazin — Facebook groups + Reddit social listening', 'Menateach — סינתזה ממקורות מרובים לסיכום יומי', 'Ayat — content drafting עם Entity Consensus', 'Yotzer — pipeline ליצירת תמונות', 'Shaliach — publishing רב-ערוצי עם CTR tracking', 'Migdalor — AEO audit: איך לגרום ל-ChatGPT/Perplexity לצטט אותך', 'Mekhayev — Brand Book generation'] },
    { id: 'a5', title: 'Research Engine + RAG', duration: '90 דק׳', points: ['Crawl4AI — deep crawling, איך לסרוק מתחרים בעומק', 'Firecrawl — structured extraction', 'DataForSEO — keyword research, SERP features, AEO', 'Mem0 + Qdrant — זיכרון פרסיסטנטי של הסוכן', 'Knowledge Base — העלאת מסמכים ל-RAG', 'Reddit API ל-social listening'] },
    { id: 'a6', title: 'CrewAI — Multi-agent workflows', duration: '75 דק׳', points: ['מתי OpenClaw לא מספיק — התפקיד של CrewAI', 'בניית Custom Agent Crew', 'תבניות Orchestration', 'Deploy · Run · Monitor'] },
    { id: 'a7', title: 'SEO + AEO Mastery', duration: '90 דק׳', points: ['Google Search Console Integration', 'SEO First-run Wizard — מה מקבלים, איך מביאים ל-100%', 'אוטומציית Schema Markup', 'AEO (Answer Engine Optimization) — ה-SEO החדש', 'Entity Consensus — למה Google מדרג אותך', 'Migdalor workflow — איך בודקים אזכורים ב-LLMs'] },
    { id: 'a8', title: 'Paid Advertising Automation', duration: '90 דק׳', points: ['Google Ads Developer Token — הגדרה מלאה', 'מבנה MCC לסוכנויות', 'יצירת קמפיינים דרך API (לא ידנית)', 'Meta Ads — Facebook + Instagram pipeline', 'Creative automation — 16+ קריאייטיבים לחודש', 'ROAS reporting + optimization loops'] },
    { id: 'a9', title: 'ניהול ערוצים בסקייל', duration: '60 דק׳', points: ['WhatsApp Business — broadcasts + template approval של מטא', 'Google Business Profile — פוסטים + ניהול ביקורות', 'Activepieces — flow automation כשסוכן לבד לא מספיק', 'אסטרטגיית Cron scheduling'] },
    { id: 'a10', title: 'Developer Tab — SSH · API · Backups', duration: '60 דק׳', points: ['SSH WebSocket Terminal — מה אפשר לעשות', 'Console + Logs — debugging של סוכנים', 'API Token — אינטגרציות עם מערכות חיצוניות', 'Backup Strategy + Restore', 'Health Monitoring + Auto-Heal', 'LLM Guard — הגנה מ-Prompt Injection'] },
    { id: 'a11', title: 'לבנות סוכנות דיגיטלית על ClawFlow', duration: '75 דק׳', points: ['Pricing Modeling ללקוחות (תוספת 250-2,000 ₪)', 'Onboarding ללקוח תוך יום אחד', 'White-label — איך מציגים את המוצר כשלכם', 'תוכנית השותפים של ClawFlow — מונטיזציה נוספת', 'Reporting Framework ללקוחות'] },
    { id: 'a12', title: 'Case Study חי — מ-0 ללקוח הראשון', duration: '90 דק׳', points: ['אני סורק פרויקט אמיתי מהעבר שהגיע ל-100K משתמשים', 'ההיפותזה הראשונית', 'הטעויות של החודש הראשון', 'מה עבד בסוף', 'מספרים, גרפים, נתונים אמיתיים'] }
  ]

  const faqs = [
    { q: 'אני לא איש טכני. אני באמת יכול להצליח?', a: 'כן — הקורס הבסיסי בנוי במיוחד לזה. לא תכתוב שורת קוד אחת. אם תדע לשלוח מייל, תדע להפעיל את ClawFlow. נתקעת? יש HAAS — עזרה אישית במחיר סביר.' },
    { q: 'האם הקורס כולל גישה ל-ClawFlow?', a: 'לא — הקורס והפלטפורמה הם מוצרים נפרדים. הקורס מלמד אותך לשלוט ב-ClawFlow. תוכניות ClawFlow מתחילות מ-₪79 לחודש (תוכנית אישית). אפשר להתחיל ניסיון חינם של 7 ימים.' },
    { q: 'מתי יוצא הקורס?', a: 'הקורס בכתיבה. כל מי שבאמתנה יקבל הודעה במייל כשהוא עולה — ועדיפות של 48 שעות להצטרפות לפני הקהל הרחב. לפעמים גם הנחה למצטרפים מוקדם.' },
    { q: 'אם אני קונה בסיסי ואחר כך רוצה מתקדם — מה קורה?', a: 'משלמים רק את ההפרש (₪1,300). לא תשלם פעמיים על אותו תוכן.' },
    { q: 'יש החזר כספי?', a: 'כן — 14 יום לפי חוק הגנת הצרכן הישראלי. אם זה לא בשבילך, מחזירים בלי שאלות.' },
    { q: 'הקורס בעברית?', a: 'הכל בעברית — וידאו, טקסט, תרגילים. הפלטפורמה עצמה דו-לשונית (עברית + אנגלית) והסוכנים מבינים עברית טבעית.' },
    { q: 'האם זה בשביל סוכנויות? יש דילים מיוחדים?', a: 'הקורס המתקדם כולל מודול שלם על הקמת סוכנות על ClawFlow (Pricing, White-label, Onboarding ללקוח). לסוכנויות עם צוות גדול — דברו איתנו על רישוי.' },
    { q: 'כמה זמן לוקח לעבור את הקורס?', a: 'בסיסי: 2-3 שעות וידאו, רוב הלומדים מסיימים בסוף שבוע. מתקדם: 15+ שעות וידאו, רצוי לפרוס על 2-4 שבועות עם תרגול מעשי.' }
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />

      <style>{`
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
        .mod-head-left{display:flex;align-items:baseline;gap:14px;}
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
        .wl-pick-btn{background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.12);color:#fff;padding:12px 10px;border-radius:var(--r);font-size:0.85rem;font-weight:500;cursor:pointer;transition:all 0.15s;text-align:center;}
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
        }
        @media(max-width:600px){
          .plan-card{padding:24px 20px;}
          .wl-card{padding:28px 22px;}
          .why-card{padding:26px 22px;}
          .why-card blockquote{font-size:1rem;}
          .mod-head h3{font-size:1.3rem;}
          .stack-grid{grid-template-columns:1fr 1fr;}
          .about-stats{grid-template-columns:1fr;}
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
                השליטה המלאה על השיווק שלך —<br />
                <span className="accent">בידיים שלך.</span>
              </h1>
              <p className="hero-lead">
                לראשונה בישראל: קורס שמלמד אותך לנהל מערך שיווק שלם עם סוכני AI. לא תיאוריה, לא מצגות —
                הדרכה צעד-אחר-צעד על פלטפורמה אמיתית שתשתמש בה כבר מחר בבוקר.
              </p>

              <div className="hero-badges">
                <span className="hero-badge">📘 בסיסי — <strong>₪199</strong></span>
                <span className="hero-badge">🎯 מתקדם — <strong>₪1,499</strong></span>
                <span className="hero-badge">♾ גישה לכל החיים</span>
                <span className="hero-badge">🔄 עדכונים חינם</span>
              </div>

              <div className="hero-btns">
                <a href="#courses" className="btn-main" onClick={(e) => { e.preventDefault(); scrollTo('courses') }}>
                  הצג את הקורסים ←
                </a>
                <a href="#waitlist" className="btn-outline" onClick={(e) => { e.preventDefault(); scrollTo('waitlist') }}>
                  הרשמה לרשימת המתנה
                </a>
              </div>

              <div className="hero-footnote">
                <div className="fn-item">
                  <span className="fn-num">8 שנות</span>
                  ניסיון בשיווק
                </div>
                <div className="fn-item">
                  <span className="fn-num">100K+</span>
                  משתמשים בפרויקטים
                </div>
                <div className="fn-item">
                  <span className="fn-num">פלטפורמה</span>
                  משלנו — לא קורס כללי
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
            <h2>שתי קהלים, שני מסלולים — אותה שליטה.</h2>
            <p className="sub">בחרת קורס? בחרת איך אתה רוצה לעבוד עם AI. אחד לבעלי עסקים שרוצים תוצאות. אחד למשווקים שרוצים להיות מומחים.</p>
          </div>

          <div className="audience-grid reveal">
            <div className="audience-card">
              <div className="audience-icon">🏪</div>
              <div className="audience-title">בעלי עסקים (SMB)</div>
              <div className="audience-desc">
                אתה מנהל עסק ורוצה שהשיווק יעבוד בלי סוכנויות ובלי פרילנסרים שמחכים שבועיים.
                לא בא לך ללמוד איך זה עובד תחת המכסה — רק להפעיל את זה ולקבל תוצאות.
              </div>
              <ul className="audience-list">
                <li>לשלוט בכל 9 סוכני השיווק של MATEH</li>
                <li>לאשר תוכן בדקות, לא שעות</li>
                <li>לחבר Google, WhatsApp, Meta ללא איש טכני</li>
                <li>לקרוא דוחות ולהחליט על סמך נתונים</li>
                <li>לדעת מתי לשלם ל-HAAS ומתי לפתור לבד</li>
              </ul>
            </div>

            <div className="audience-card">
              <div className="audience-icon">🎯</div>
              <div className="audience-title">משווקים דיגיטליים ופרילנסרים</div>
              <div className="audience-desc">
                אתה בתחום, מבין את המשחק, ורוצה להפוך להיות המומחה שכולם מפנים אליו.
                לבנות שירות שמבוסס על AI — למעצמה שלך או ללקוחות.
              </div>
              <ul className="audience-list">
                <li>לשלוט ב-LiteLLM, Claude API, Ollama בעלות מיטבית</li>
                <li>לעצב USER.md ו-BRAND.md לכל לקוח</li>
                <li>לבנות Skills מותאמים ב-Python/Node</li>
                <li>להפעיל Google Ads + Meta דרך API</li>
                <li>לבנות סוכנות שיווק על ClawFlow עם MCC ו-White-label</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* THE PLATFORM INSIDE */}
      <div className="phil-strip">
        <div className="wrap">
          <div className="phil-inner">
            <div className="phil-label">
              מה בפנים?<br/><em>פלטפורמה אמיתית.</em>
            </div>
            <div className="phil-items">
              <div className="phil-item">
                <div className="phil-num">01</div>
                <div className="phil-title">9 סוכני MATEH מוכנים לעבודה</div>
                <div className="phil-desc">Sayer · Meater · Maazin · Menateach · Ayat · Yotzer · Shaliach · Migdalor · Mekhayev. כל אחד עם cron, מודל, prompts ו-outputs משלו.</div>
              </div>
              <div className="phil-item">
                <div className="phil-num">02</div>
                <div className="phil-title">תזמור חכם של מודלים</div>
                <div className="phil-desc">LiteLLM Gateway + Claude Haiku/Sonnet/Opus + OpenAI fallback + Ollama מקומי. $2 במקום $200 על אותה תוצאה.</div>
              </div>
              <div className="phil-item">
                <div className="phil-num">03</div>
                <div className="phil-title">זיכרון ומחקר אמיתיים</div>
                <div className="phil-desc">Mem0 + Qdrant (Vector DB), Crawl4AI, Firecrawl, DataForSEO, Reddit API. הסוכן זוכר את העסק ומוציא נתונים אמיתיים.</div>
              </div>
              <div className="phil-item">
                <div className="phil-num">04</div>
                <div className="phil-title">הכל מחובר — ערוצים ופרסום</div>
                <div className="phil-desc">Google Workspace, Meta Ads, Google Ads, WhatsApp Business, Google Business Profile, Activepieces. לא צריך Zapier.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STACK GRID */}
      <section className="section">
        <div className="wrap">
          <div className="sh reveal">
            <div className="eyebrow">הסטאק שתשלוט בו</div>
            <h2>כל הטכנולוגיה שתלמד — בכל קורס ברמה המתאימה.</h2>
            <p className="sub">הקורס הבסיסי ילמד אותך להפעיל את הכל. המתקדם ילמד אותך לכוונן, להתאים ולהרחיב.</p>
          </div>
          <div className="stack-grid reveal">
            <div className="stack-item"><span className="stack-item-dot"></span><strong>OpenClaw</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>Claude API</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>LiteLLM</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>Ollama</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>Mem0 + Qdrant</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>Crawl4AI</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>Firecrawl</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>DataForSEO</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>Google Workspace</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>Google Ads API</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>Meta Ads</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>WhatsApp Business</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>Google Business</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>Activepieces</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>CrewAI</strong></div>
            <div className="stack-item"><span className="stack-item-dot"></span><strong>LLM Guard</strong></div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="section" id="courses">
        <div className="wrap">
          <div className="sh reveal">
            <div className="eyebrow">הקורסים</div>
            <h2>בחר את המסלול שלך</h2>
            <p className="sub">שני קורסים. שתי מטרות שונות. מחיר שמאפשר לכולם להתחיל.</p>
          </div>

          <div className="plans-grid reveal">
            {/* BASIC */}
            <div className="plan-card">
              <div className="plan-name">📘 קורס בסיסי</div>
              <div className="plan-title">ClawFlow לבעלי עסקים</div>
              <div className="plan-desc">לשלוט בסוכני AI של השיווק שלך תוך שעתיים. בלי להבין קוד. בלי להתעסק בצד הטכני.</div>
              <div className="plan-price">₪199<small>חד-פעמי</small></div>
              <div className="plan-meta">~2.5 שעות וידאו · 6 מודולים · גישה לכל החיים · עדכונים חינם</div>
              <ul className="plan-features">
                <li>אונבורדינג מלא לפלטפורמה בצעד-אחר-צעד</li>
                <li>ניהול 9 סוכני MATEH בשפה פשוטה</li>
                <li>חיבור כל האינטגרציות (Google, Meta, WhatsApp)</li>
                <li>שגרת בוקר יומית של 15 דקות</li>
                <li>מתי לעבוד לבד ומתי להזמין HAAS</li>
                <li>צ׳ק-ליסט של השבוע הראשון</li>
              </ul>
              <button className="plan-cta outline" onClick={() => pickCourse('basic')}>שמור מקום בקורס הבסיסי ←</button>
            </div>

            {/* ADVANCED */}
            <div className="plan-card featured">
              <span className="plan-featured-tag">הכי מקיף בישראל</span>
              <div className="plan-name">🎯 קורס מתקדם</div>
              <div className="plan-title">ClawFlow Mastery</div>
              <div className="plan-desc">להפוך למומחה AI שיווק. לבנות מערכים לעצמך וללקוחות. להקים סוכנות על הפלטפורמה.</div>
              <div className="plan-price">₪1,499<small>חד-פעמי</small></div>
              <div className="plan-meta">~15 שעות וידאו · 12 מודולים · גישה לכל החיים · עדכונים חינם · Q&A חודשי</div>
              <ul className="plan-features">
                <li>כל מה שבבסיסי + כיוונון עמוק של המערכת</li>
                <li>USER.md + BRAND.md + יצירת Skills מותאמים</li>
                <li>LiteLLM routing, cost optimization, Ollama</li>
                <li>Google Ads API + Meta Ads דרך קוד</li>
                <li>Mem0, Crawl4AI, DataForSEO deep-dive</li>
                <li>הקמת סוכנות דיגיטלית על ClawFlow</li>
                <li>Case study חי: מ-0 ל-100K משתמשים</li>
                <li>קבוצת טלגרם סגורה לבוגרים</li>
                <li>שדרגת מבסיסי? משלמים רק ₪1,300 הפרש</li>
              </ul>
              <button className="plan-cta" onClick={() => pickCourse('advanced')}>שמור מקום בקורס המתקדם ←</button>
            </div>
          </div>
        </div>
      </section>

      {/* BASIC MODULES */}
      <section className="mod-section">
        <div className="wrap">
          <div className="mod-head reveal">
            <div className="mod-head-left">
              <h3>📘 תוכנית הקורס הבסיסי</h3>
              <span className="mod-price-badge">₪199</span>
            </div>
            <div className="mod-meta">6 מודולים · ~2.5 שעות · hands-on לאורך כל הדרך</div>
          </div>

          <div className="mod-list reveal">
            {basicModules.map((m, i) => {
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

      {/* ADVANCED MODULES */}
      <section className="mod-section" style={{ background: 'var(--bg-3)' }}>
        <div className="wrap">
          <div className="mod-head reveal">
            <div className="mod-head-left">
              <h3>🎯 תוכנית הקורס המתקדם</h3>
              <span className="mod-price-badge">₪1,499</span>
            </div>
            <div className="mod-meta">12 מודולים · ~15 שעות · Case study חי · קבוצת בוגרים</div>
          </div>

          <div className="mod-list reveal">
            {advModules.map((m, i) => {
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
            <h2>אם אתה יודע לשלוח מייל — אתה תסתדר.</h2>
            <p className="sub" style={{ margin: '0 auto' }}>
              הקורס הבסיסי נבנה לאדם שמעולם לא נגע בקוד. לא ChatGPT prompts מתקדמים. לא API.
              רק ממשק נקי, הסברים בעברית, ומישהו שלוקח אותך ביד.
            </p>
          </div>

          <div className="audience-grid reveal">
            <div className="audience-card">
              <div className="audience-icon">✋</div>
              <div className="audience-title">0 שורות קוד</div>
              <div className="audience-desc">כל המודולים של הקורס הבסיסי — נקודה ולחיצה. לא נפתחת שורת פקודה. לא מתקינים כלום במחשב.</div>
            </div>
            <div className="audience-card">
              <div className="audience-icon">🎯</div>
              <div className="audience-title">שגרה של 15 דקות ביום</div>
              <div className="audience-desc">אחרי האונבורדינג הראשוני, עבודה יומית: לבדוק התראות, לאשר תוכן, לקרוא סיכום. זהו.</div>
            </div>
          </div>
        </div>
      </section>

      {/* HAAS */}
      <section className="has-section" id="has">
        <div className="wrap">
          <div className="has-inner">
            <div className="has-text reveal">
              <div className="eyebrow">נתקעתם? יש בן אדם</div>
              <h2>אף אחד לא נשאר לבד — Human as a Service</h2>
              <p>
                זה הכי גדול. אנחנו לא מוכרים לך קורס ונעלמים. אם תתקע בהתקנה,
                באינטגרציה עם Google, בבעיה עם הסוכן — תשלח הודעה. אני עונה אישית.
              </p>
              <p>
                ללא מנוי חודשי. ללא מחירון נוקשה. לפי מקרה — ותמיד הוגן.
                לבוגרי הקורס המתקדם יש תעריף מופחת, ותמיכה עדיפה בקבוצת הטלגרם הסגורה.
              </p>
              <div className="has-price-note">
                💡 <strong>בוגרי הקורס</strong> — תעריף מיוחד ותור קצר
              </div>
              <div className="has-steps">
                <div className="has-step">
                  <div className="has-step-num">1</div>
                  <div className="has-step-text"><strong>שולחים הודעה</strong> — ספרו מה הבעיה, מה ניסיתם</div>
                </div>
                <div className="has-step">
                  <div className="has-step-num">2</div>
                  <div className="has-step-text"><strong>מקבלים הצעה</strong> — היקף, זמן, עלות הוגנת</div>
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
                "הייתי יכול לגבות ₪4,000 על הקורס המתקדם. קורסים פחות מפורטים עולים את זה.
                אבל המטרה שלי אחרת — אני רוצה שכל בעל עסק בישראל יוכל להתחיל. הכסף שלי מגיע מהפלטפורמה,
                לא מהקורס. הקורס הוא הגשר."
              </blockquote>
              <cite>— סרגיי גופמן, מייסד Flowmatic</cite>
              <p style={{ fontSize: '0.87rem', color: 'var(--ink-3)', marginTop: 18, lineHeight: 1.7 }}>
                ₪199 זה חופן ארוחות. ₪1,499 זה פחות מיום של פרילנסר שיעשה לך חצי עבודה.
                מה שמרוויחים מהקורס — חוזר אליך בשורה התחתונה של העסק, לא לכיס שלי.
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
            <h2>מי זה בכלל מלמד אותך?</h2>
          </div>

          <div className="about-grid reveal">
            <div className="about-avatar">סג</div>
            <div className="about-text">
              <div className="about-name">סרגיי גופמן</div>
              <div className="about-role">מייסד Flowmatic · בונה ClawFlow · משווק מ-2017</div>
              <p>
                מ-2017 בשיווק דיגיטלי — עבדתי עם עשרות פרויקטים, גם בתור סטודיו וגם עצמאית.
                הובלתי קמפיינים אורגניים למעל 100,000 משתמשים, ניהלתי תקציבי פרסום ממומן,
                עבדתי יד ביד עם מעצבי UX/UI. ראיתי את המקצוע משני הצדדים.
              </p>
              <p>
                כשה-AI הגיע לחיינו, הבנתי שמגיע משהו הרבה יותר גדול מ"כתוב לי מייל ב-ChatGPT".
                בניתי את ClawFlow — פלטפורמה טכנולוגית שמאפשרת לכל אחד לנהל מחזור שיווק שלם
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
                  <span>בנויים ומתואמים</span>
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
              <h2>הקורס בכתיבה. הצטרף לרשימה ותהיה ראשון להיכנס.</h2>
              <p>
                אני כותב את הקורס עכשיו — מודול אחרי מודול, סרטון אחרי סרטון.
                בגלל שכל מה שקשור ב-AI משתנה כל חודש, אני לא רוצה להוציא משהו חצי מבושל.
              </p>
              <p>
                <strong>מי שבאמתנה מקבל:</strong>
              </p>
              <div className="has-steps">
                <div className="has-step">
                  <div className="has-step-num">1</div>
                  <div className="has-step-text"><strong>התראה מוקדמת</strong> — 48 שעות לפני שהקורס יוצא לקהל הרחב</div>
                </div>
                <div className="has-step">
                  <div className="has-step-num">2</div>
                  <div className="has-step-text"><strong>הנחת השקה</strong> — למצטרפים מוקדם בלבד, בפעם הראשונה שהקורס עולה</div>
                </div>
                <div className="has-step">
                  <div className="has-step-num">3</div>
                  <div className="has-step-text"><strong>עדכונים שקופים</strong> — מעדכן אתכם לאורך הדרך באיזה שלב אני, מה כבר מוכן</div>
                </div>
                <div className="has-step">
                  <div className="has-step-num">4</div>
                  <div className="has-step-text"><strong>השפעה על התוכן</strong> — אשאל אתכם מה הכי חשוב ללמד ראשון</div>
                </div>
              </div>
            </div>

            <div className="wl-card reveal">
              <div className="eyebrow">הצטרפות לרשימת המתנה</div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 10 }}>שמור לי מקום</h2>
              <p>בחר באיזה קורס את.ה מתעניין.ת. אני שולח עדכון כשזה יוצא — לא ספאם, הבטחה.</p>

              <div className="wl-pick">
                <button className={`wl-pick-btn ${coursePick === 'basic' ? 'active' : ''}`} onClick={() => setCoursePick('basic')}>
                  📘 בסיסי
                  <span className="wl-pick-price">₪199</span>
                </button>
                <button className={`wl-pick-btn ${coursePick === 'advanced' ? 'active' : ''}`} onClick={() => setCoursePick('advanced')}>
                  🎯 מתקדם
                  <span className="wl-pick-price">₪1,499</span>
                </button>
                <button className={`wl-pick-btn ${coursePick === 'both' ? 'active' : ''}`} onClick={() => setCoursePick('both')}>
                  ⚡ שניהם
                  <span className="wl-pick-price">שדרוג ב-₪1,300</span>
                </button>
              </div>

              <input type="text" id="wl-name" className="wl-field" placeholder="שם מלא" />
              <input type="email" id="wl-email" className="wl-field" placeholder="האימייל שלך" />
              <input type="tel" id="wl-phone" className="wl-field" placeholder="טלפון (לא חובה)" dir="ltr" />
              <select id="wl-role" className="wl-field" defaultValue="">
                <option value="">מה תפקידך? (לא חובה)</option>
                <option value="בעל/ת עסק">בעל/ת עסק</option>
                <option value="משווק/ת דיגיטלי/ת">משווק/ת דיגיטלי/ת</option>
                <option value="פרילנסר/ית">פרילנסר/ית</option>
                <option value="סוכנות">סוכנות דיגיטל</option>
                <option value="אחר">אחר</option>
              </select>

              <div id="wl-success" style={{ display: 'none', background: 'rgba(42,122,75,0.15)', border: '1px solid rgba(42,122,75,0.4)', borderRadius: 8, padding: 14, textAlign: 'center', color: '#6EE7A7', fontWeight: 600, marginBottom: 10 }}>
                ✅ נרשמת! תקבל הודעה במייל ברגע שהקורס מוכן.
              </div>
              <button className="wl-submit" id="wl-submit" onClick={submitWaitlist}>שמור את מקומי ←</button>
              <p className="wl-micro">ללא ספאם · ביטול בכל עת · העדיפות ניתנת לנרשמים מוקדם</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="wrap">
          <div className="sh reveal" style={{ maxWidth: 760, margin: '0 auto 32px' }}>
            <div className="eyebrow">שאלות נפוצות</div>
            <h2>הכל מה שרצית לדעת</h2>
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
              עדיין יש שאלות? <a href="/about" style={{ color: 'var(--accent)', fontWeight: 500 }}>כנסו לעמוד על פלומטיק</a> או שלחו לנו הודעה.
            </p>
            <a href="#waitlist" className="btn-main" onClick={(e) => { e.preventDefault(); scrollTo('waitlist') }}>
              הצטרף לרשימת ההמתנה ←
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
