'use client'

export default function SiteNav() {
  return (
    <nav>
      <div className="wrap">
        <div className="nav-inner">
          <a href="/" className="logo">
            <img src="/logo.png" alt="Flowmatic" />
          </a>

          <ul className="nav-center">
            <li><a href="/#courses" className="nav-link">מסלולים</a></li>
            <li><a href="/#faq" className="nav-link">שאלות נפוצות</a></li>
          </ul>

          <div className="nav-right">
            <a href="https://clawflow.flowmatic.co.il" target="_blank" rel="noopener noreferrer" className="yt-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
              פלטפורמה
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
