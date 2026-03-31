export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-about">
            <a href="/" className="footer-logo">
              <img src="/logo.png" alt="Flowmatic" />
            </a>
            <p>סוכן AI לעסקים ישראלים — מדריכים ל-OpenClaw, אוטומציה עם בינה מלאכותית, כלים מומלצים ועזרה אישית. הכל חינמי, בעברית.</p>
          </div>
          <div className="footer-col">
            <h5>תוכן</h5>
            <ul>
              <li><a href="/blog/">בלוג</a></li>
              <li><a href="https://youtube.com/@OpenClawIsrael" target="_blank" rel="noopener noreferrer">YouTube ↗</a></li>
              <li><a href="/#newsletter">ניוזלטר</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>כלים שלנו</h5>
            <ul>
              <li><a href="https://clawflow.flowmatic.co.il" target="_blank" rel="noopener noreferrer">ClawFlow ↗</a></li>
              <li><a href="https://kol-ai.xyz" target="_blank" rel="noopener noreferrer">קול VoiceAI ↗</a></li>
              <li><a href="/#has">Human as a Service</a></li>
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
            <a href="/privacy">פרטיות</a>
            <a href="/disclosure">גילוי נאות</a>
            <a href="/contact">יצירת קשר</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
