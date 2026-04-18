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
            <li><a href="/#courses" className="nav-link">הקורסים</a></li>
            <li><a href="/#waitlist" className="nav-link">רשימת המתנה</a></li>
            <li><a href="/blog/" className="nav-link">בלוג</a></li>
            <li><a href="/about/" className="nav-link">על פלומטיק</a></li>
          </ul>

          <div className="nav-right">
            <a href="https://clawflow.flowmatic.co.il" target="_blank" rel="noopener noreferrer" className="yt-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
              אחסון ClawFlow
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
