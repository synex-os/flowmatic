'use client'

import { useEffect, useRef, useState } from 'react'

export default function SiteNav() {
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

  return (
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
                  <a href="https://clawflow.flowmatic.co.il" target="_blank" rel="noopener noreferrer" className="mega-item">
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
            <li><a href="/blog/" className="nav-link">בלוג</a></li>
            <li><a href="/#has" className="nav-link">עזרה אישית</a></li>
            <li><a href="/#newsletter" className="nav-link">ניוזלטר</a></li>
          </ul>

          <div className="nav-right">
            <a href="https://clawflow.flowmatic.co.il" target="_blank" rel="noopener noreferrer" className="yt-link">
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
  )
}
