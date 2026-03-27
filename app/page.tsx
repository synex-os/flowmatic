'use client'

import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [megaOpen, setMegaOpen] = useState(false)
  const megaRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        megaRef.current &&
        !megaRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setMegaOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in')
        })
      },
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* NAV */}
      <nav>
        <div className="wrap">
          <div className="nav-inner">
            <a href="/" className="logo">
              <img src="/logo.png" alt="Flowmatic" />
            </a>

            <ul className="nav-center">
              <li>
                <span
                  ref={triggerRef}
                  className={`nav-link${megaOpen ? ' open' : ''}`}
                  onClick={() => setMegaOpen(!megaOpen)}
                >
                  כלים
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 4l4 4 4-4" />
                  </svg>
                </span>
                <div ref={megaRef} className={`mega${megaOpen ? ' open' : ''}`}>
                  <div className="mega-inner-wrap">
                  <div className="mega-col">
                    <div className="mega-col-title">הכלים שלנו</div>
                    <a href="https://openclaw.flowmatic.co.il" target="_blank" rel="noopener noreferrer" className="mega-item">
                      <div className="mega-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                      </div>
                      <div>
                        <div className="mega-name">ClawFlow ↗</div>
                        <div className="mega-desc">אירוח סוכני AI — מוכן תוך 3 דקות</div>
                      </div>
                    </a>
                    <a href="https://kol-ai.xyz" target="_blank" rel="noopener noreferrer" className="mega-item">
                      <div className="mega-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.07 3h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .57 2.57 2 2 0 0 1-.45 2.11L8.09 11.5a16 16 0 0 0 6.41 6.41l2.1-2.1a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.57.57 2 2 0 0 1 1.72 2z"/></svg>
                      </div>
                      <div>
                        <div className="mega-name">קול VoiceAI ↗</div>
                        <div className="mega-desc">ה-AI שלך מתקשר ללידים ועונה בעברית</div>
                      </div>
                      <span className="mega-badge new">Beta</span>
                    </a>
                  </div>
                  <div className="mega-col">
                    <div className="mega-col-title">סטאק מומלץ</div>
                    <div className="mega-item">
                      <div className="mega-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z"/><rect x="3" y="8" width="18" height="14" rx="2"/><path d="M12 12v4"/></svg>
                      </div>
                      <div>
                        <div className="mega-name">Claude API</div>
                        <div className="mega-desc">מוח הסוכן — עברית מצוינת</div>
                      </div>
                    </div>
                    <div className="mega-item">
                      <div className="mega-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                      </div>
                      <div>
                        <div className="mega-name">ElevenLabs</div>
                        <div className="mega-desc">TTS קולי לסוכן — עברית</div>
                      </div>
                      <span className="mega-badge">אפיליאט</span>
                    </div>
                    <div className="mega-item">
                      <div className="mega-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      </div>
                      <div>
                        <div className="mega-name">Activepieces</div>
                        <div className="mega-desc">אוטומציות open-source, MIT</div>
                      </div>
                      <span className="mega-badge" style={{ background: '#EEF2FF', color: '#4338CA' }}>MIT</span>
                    </div>
                    <div className="mega-item">
                      <div className="mega-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      </div>
                      <div>
                        <div className="mega-name">n8n</div>
                        <div className="mega-desc">אוטומציות open-source, fair-code</div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </li>
              <li>
                <a href="/blog/" className="nav-link">
                  בלוג
                </a>
              </li>
              <li>
                <a href="#has" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('has') }}>
                  עזרה אישית
                </a>
              </li>
              <li>
                <a href="#newsletter" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('newsletter') }}>
                  ניוזלטר
                </a>
              </li>
            </ul>

            <div className="nav-right">
              <a href="https://openclaw.flowmatic.co.il" target="_blank" rel="noopener noreferrer" className="yt-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
                אירוח ClawFlow
              </a>
              <a href="https://youtube.com/@OpenClawIsrael" target="_blank" rel="noopener noreferrer" className="yt-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
                </svg>
                YouTube
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-inner">
            <div>
              <div className="hero-kicker">
                <span className="kicker-line"></span>
                המשאב הישראלי הראשון ל-OpenClaw
              </div>
              <h1>
                הכל כאן.<br />
                הכל <span className="accent">חינמי.</span><br />
                בעברית.
              </h1>
              <p className="hero-lead">
                מדריכים מעשיים על OpenClaw לעסקים ישראלים. ללא paywall, ללא שטויות — רק תוכן שעוזר. אם נתקעתם, יש גם בן אדם מאחורה.
              </p>
              <div className="hero-btns">
                <a href="#guides" className="btn-main" onClick={(e) => { e.preventDefault(); scrollTo('guides') }}>
                  התחילו לקרוא ←
                </a>
                <a href="#has" className="btn-outline" onClick={(e) => { e.preventDefault(); scrollTo('has') }}>
                  צריכים עזרה אישית?
                </a>
              </div>
              <div className="hero-footnote">
                <div className="fn-item">
                  <span className="fn-num">15+</span>
                  מדריכים חינמיים
                </div>
                <div className="fn-item">
                  <span className="fn-num">0₪</span>
                  עלות הגישה לתוכן
                </div>
                <div className="fn-item">
                  <span className="fn-num">2026</span>
                  עדכני לחלוטין
                </div>
              </div>
            </div>

            {/* NEWSLETTER CARD */}
            <div className="nl-card" id="newsletter">
              <span className="nl-badge">חינמי</span>
              <h3>קבלו מדריך PDF + עדכונים שבועיים</h3>
              <p>טיפים מעשיים, כלים חדשים, ועדכוני OpenClaw — ישירות למייל. ללא ספאם.</p>
              <div className="nl-perks">
                <div className="nl-perk"><span className="nl-perk-dot"></span>מדריך PDF מלא לנרשמים חדשים</div>
                <div className="nl-perk"><span className="nl-perk-dot"></span>עדכונים לפני כולם</div>
                <div className="nl-perk"><span className="nl-perk-dot"></span>תוכן ישראלי — לא תרגום</div>
              </div>
              <input type="email" className="nl-field" placeholder="האימייל שלכם" />
              <button className="nl-submit">קבלו גישה חינמית ←</button>
              <p className="nl-micro">ביטול בכל עת · ללא ספאם</p>
              <div className="nl-proof">
                <div className="nl-faces">
                  <div className="nl-face">א</div>
                  <div className="nl-face">ד</div>
                  <div className="nl-face">מ</div>
                  <div className="nl-face">י</div>
                </div>
                <div className="nl-count" style={{ marginRight: '14px' }}>
                  <strong>+400</strong> בעלי עסקים
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <div className="phil-strip">
        <div className="wrap">
          <div className="phil-inner">
            <div className="phil-label">
              למה <em>הכל</em><br />חינמי?
            </div>
            <div className="phil-items">
              <div className="phil-item">
                <div className="phil-num">01</div>
                <div className="phil-title">תוכן טוב מדבר בעד עצמו</div>
                <div className="phil-desc">אם המדריך עוזר — אנשים חוזרים, ממליצים, ותומכים. זה מספיק.</div>
              </div>
              <div className="phil-item">
                <div className="phil-num">02</div>
                <div className="phil-title">ישראל צריכה תוכן AI בעברית</div>
                <div className="phil-desc">כל המשאבים הטובים באנגלית. אנחנו פה כדי לשנות את זה.</div>
              </div>
              <div className="phil-item">
                <div className="phil-num">03</div>
                <div className="phil-title">אפיליאט שקוף</div>
                <div className="phil-desc">כשממליצים על כלי — יש לינק אפיליאט. תמיד מסמנים אותו בגלוי.</div>
              </div>
              <div className="phil-item">
                <div className="phil-num">04</div>
                <div className="phil-title">Human as a Service</div>
                <div className="phil-desc">מי שלא מצליח לבד — יכול לבקש עזרה אישית. בתשלום, ללא מחיר קבוע.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GUIDES */}
      <section className="section" id="guides">
        <div className="wrap">
          <div className="sh reveal">
            <div className="eyebrow">מדריכים</div>
            <h2>למדו OpenClaw מאפס</h2>
            <p className="sub">כל המדריכים מעשיים, מעודכנים ל-2026, ועם צילומי מסך מלאים.</p>
          </div>
          <div className="guides-grid guides-single reveal">
            <a href="/blog/openclaw-complete-guide-2026/" className="guide-card guide-featured" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="guide-tag">⭐ מומלץ להתחלה</div>
              <div className="guide-title" style={{ fontSize: '1.2rem' }}>המדריך המלא ל-OpenClaw 2026 — מאפס לסוכן AI עובד תוך שעה</div>
              <div className="guide-desc">הגדרת שרת, אבטחה, חיבור טלגרם, Google Workspace, זיכרון, אוטומציות, ניתוב מודלים, קול, וסאב-אגנטים. ללא שורת קוד אחת.</div>
              <div className="guide-foot">
                <span>📗 הדרך הפשוטה · 55 דקות קריאה · עודכן 2026-03-19</span>
                <span className="guide-read">קראו את המדריך ←</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="section" id="tools">
        <div className="wrap">
          <div className="sh reveal">
            <div className="eyebrow">כלים</div>
            <h2>הסטאק שעובד</h2>
            <p className="sub">כלים שנבדקו אישית — הכלים שלנו ורשימת ספקים מומלצים. לינקי אפיליאט מסומנים תמיד בגלוי.</p>
          </div>
          <div className="tools-section-grid reveal">
            <div>
              <div className="tools-section-title">
                <span>🛠</span> הכלים שלנו
              </div>
              <div className="tools-list">
                <a href="https://openclaw.flowmatic.co.il" target="_blank" rel="noopener noreferrer" className="tool-row">
                  <div className="tool-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="tool-name">ClawFlow ↗</div>
                    <div className="tool-desc">אירוח סוכני AI — מוכן תוך 3 דקות, ללא הגדרות טכניות</div>
                  </div>
                  <span className="tool-badge ours">שלנו</span>
                  <span className="tool-cta">התחילו ←</span>
                </a>
                <a href="https://kol-ai.xyz" target="_blank" rel="noopener noreferrer" className="tool-row">
                  <div className="tool-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.07 3h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .57 2.57 2 2 0 0 1-.45 2.11L8.09 11.5a16 16 0 0 0 6.41 6.41l2.1-2.1a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.57.57 2 2 0 0 1 1.72 2z"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="tool-name">קול VoiceAI ↗</div>
                    <div className="tool-desc">ה-AI שלך מתקשר ללידים, עונה בעברית טבעית</div>
                  </div>
                  <span className="tool-badge free">יש גרסה חינמית</span>
                  <span className="tool-cta">נסו בחינם ←</span>
                </a>
              </div>
            </div>
            <div>
              <div className="tools-section-title">
                <span>⚡</span> סטאק מומלץ
              </div>
              <div className="tools-list">
                <div className="tool-row">
                  <div className="tool-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z"/><rect x="3" y="8" width="18" height="14" rx="2"/><path d="M12 12v4"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="tool-name">Claude API</div>
                    <div className="tool-desc">מוח הסוכן — עברית מצוינת, היגיון עסקי</div>
                  </div>
                  <span className="tool-badge">מומלץ</span>
                  <a href="#" className="tool-cta">פתחו חשבון ←</a>
                </div>
                <div className="tool-row">
                  <div className="tool-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="tool-name">ElevenLabs</div>
                    <div className="tool-desc">TTS בעברית לסוכן קולי — קול טבעי</div>
                  </div>
                  <span className="tool-badge aff">אפיליאט</span>
                  <a href="#" className="tool-cta">נסו בחינם ←</a>
                </div>
                <div className="tool-row">
                  <div className="tool-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="tool-name">Activepieces</div>
                    <div className="tool-desc">אוטומציות open-source לחיבור כלים — רישיון MIT</div>
                  </div>
                  <span className="tool-badge mit">MIT</span>
                  <a href="#" className="tool-cta">Self-host ←</a>
                </div>
                <div className="tool-row">
                  <div className="tool-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="tool-name">n8n</div>
                    <div className="tool-desc">אוטומציות open-source — 400+ אינטגרציות, fair-code</div>
                  </div>
                  <a href="#" className="tool-cta">Self-host ←</a>
                </div>
                <div className="tool-row">
                  <div className="tool-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="tool-name">Brave Search API</div>
                    <div className="tool-desc">חיפוש לסאב-אגנטים — $5 חינמי לחודש</div>
                  </div>
                  <span className="tool-badge">חינמי</span>
                  <a href="#" className="tool-cta">הגדירו ←</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HUMAN AS A SERVICE */}
      <section className="has-section" id="has">
        <div className="wrap">
          <div className="has-inner">
            <div className="has-text reveal">
              <div className="eyebrow">עזרה אישית</div>
              <h2>כשהמדריך לא מספיק — יש בן אדם מאחורה</h2>
              <p>
                כל התוכן כאן חינמי ומפורט ככל האפשר. אבל לפעמים — נתקעים. הגדרה שלא עובדת, שגיאה שלא מובנת, או שפשוט רוצים שמישהו יעשה את זה בשבילכם.
              </p>
              <p>
                שלחו טופס, ספרו מה צריכים — ואחזור עם הצעה מותאמת אישית. ללא מחיר קבוע, כי כל מקרה שונה.
              </p>
              <div className="has-price-note">
                💡 אין מחירון קבוע — <strong>הכל לפי הצורך</strong>
              </div>
              <div className="has-steps">
                <div className="has-step">
                  <div className="has-step-num">1</div>
                  <div className="has-step-text"><strong>שולחים טופס</strong> — מספרים מה הבעיה, מה כבר ניסיתם</div>
                </div>
                <div className="has-step">
                  <div className="has-step-num">2</div>
                  <div className="has-step-text"><strong>מקבלים הצעה</strong> — היקף, זמן, ועלות מוצעת</div>
                </div>
                <div className="has-step">
                  <div className="has-step-num">3</div>
                  <div className="has-step-text"><strong>מחליטים</strong> — ללא לחץ, ללא התחייבות</div>
                </div>
              </div>
            </div>
            <div className="has-form-card reveal">
              <div className="has-form-head">
                <p>HUMAN AS A SERVICE</p>
                <h4>שלחו בקשה לעזרה</h4>
              </div>
              <div className="has-form-body">
                <div className="form-row">
                  <label className="form-label">שם</label>
                  <input type="text" className="form-input" placeholder="השם שלכם" />
                </div>
                <div className="form-row">
                  <label className="form-label">אימייל / וואטסאפ</label>
                  <input type="text" className="form-input" placeholder="איך ניצור קשר?" />
                </div>
                <div className="form-row">
                  <label className="form-label">מה אתם צריכים?</label>
                  <select className="form-select" defaultValue="">
                    <option value="">בחרו סוג עזרה...</option>
                    <option>הקמת OpenClaw מאפס</option>
                    <option>פתרון בעיה ספציפית</option>
                    <option>חיבור אינטגרציה</option>
                    <option>בניית אוטומציה</option>
                    <option>אחר</option>
                  </select>
                </div>
                <div className="form-row">
                  <label className="form-label">ספרו בקצרה</label>
                  <textarea className="form-textarea" placeholder="מה ניסיתם? איפה נתקעתם? מה המטרה?"></textarea>
                </div>
                <button className="form-submit">שלחו בקשה ←</button>
                <p className="form-note">אחזור תוך 24 שעות · ללא התחייבות</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-about">
              <a href="/" className="footer-logo">
                <img src="/logo.png" alt="Flowmatic" />
              </a>
              <p>המשאב הישראלי הראשון ל-OpenClaw — תוכן חינמי, כלים, ועזרה אישית לעסקים בעברית.</p>
            </div>
            <div className="footer-col">
              <h5>תוכן</h5>
              <ul>
                <li><a href="/blog/">בלוג</a></li>
                <li><a href="https://youtube.com/@OpenClawIsrael" target="_blank" rel="noopener noreferrer">YouTube ↗</a></li>
                <li><a href="#newsletter">ניוזלטר</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>כלים שלנו</h5>
              <ul>
                <li><a href="https://openclaw.flowmatic.co.il" target="_blank" rel="noopener noreferrer">ClawFlow ↗</a></li>
                <li><a href="https://kol-ai.xyz" target="_blank" rel="noopener noreferrer">קול VoiceAI ↗</a></li>
                <li><a href="#has">Human as a Service</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>סטאק</h5>
              <ul>
                <li><a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">Claude API ↗</a></li>
                <li><a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer">ElevenLabs ↗</a></li>
                <li><a href="https://www.activepieces.com" target="_blank" rel="noopener noreferrer">Activepieces ↗</a></li>
                <li><a href="https://n8n.io" target="_blank" rel="noopener noreferrer">n8n ↗</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 flowmatic.co.il · לינקי אפיליאט מסומנים בגלוי</span>
            <div className="footer-legal">
              <a href="#">פרטיות</a>
              <a href="#">גילוי נאות</a>
              <a href="#">יצירת קשר</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
