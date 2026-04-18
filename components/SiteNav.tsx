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
