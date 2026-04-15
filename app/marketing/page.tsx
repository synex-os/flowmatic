import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ניהול שיווק — Flowmatic',
  description: 'ניהול שיווק מקצועי עם סוכני AI. SEO, פרסום ממומן, יצירת תוכן — הכל על אוטומט עם בקרה אנושית. מ-₪299/חודש.',
  alternates: { canonical: 'https://flowmatic.co.il/marketing' },
}

export default function MarketingPage() {
  return (
    <>
      <style>{`
        .mkt-hero { padding: 60px 0 40px; text-align: center; }
        .mkt-hero h1 { font-size: 2.2rem; font-weight: 800; color: #1F2937; margin: 0 0 16px; line-height: 1.3; }
        .mkt-hero p { font-size: 1.1rem; color: #6B7280; max-width: 600px; margin: 0 auto 24px; line-height: 1.7; }
        .mkt-badge { display: inline-block; background: #EFF6FF; color: #2563EB; font-size: 0.82rem; font-weight: 600; padding: 4px 14px; border-radius: 20px; margin-bottom: 16px; }

        .mkt-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 40px 0; }
        @media(max-width:900px) { .mkt-grid { grid-template-columns: 1fr; } }

        .mkt-card { background: #fff; border: 2px solid #E5E7EB; border-radius: 16px; padding: 28px 24px; position: relative; transition: border-color 0.2s, box-shadow 0.2s; }
        .mkt-card:hover { border-color: #2563EB; box-shadow: 0 4px 20px rgba(37,99,235,0.1); }
        .mkt-card.popular { border-color: #2563EB; }
        .mkt-popular-tag { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #2563EB; color: #fff; font-size: 0.72rem; font-weight: 700; padding: 3px 14px; border-radius: 10px; }

        .mkt-card-icon { font-size: 1.8rem; margin-bottom: 12px; }
        .mkt-card-name { font-size: 1.2rem; font-weight: 700; color: #1F2937; margin-bottom: 4px; }
        .mkt-card-desc { font-size: 0.85rem; color: #6B7280; margin-bottom: 16px; line-height: 1.5; }
        .mkt-price { font-size: 2rem; font-weight: 800; color: #1F2937; }
        .mkt-price span { font-size: 0.85rem; font-weight: 400; color: #9CA3AF; }
        .mkt-price-note { font-size: 0.75rem; color: #9CA3AF; margin-top: 4px; }

        .mkt-features { list-style: none; padding: 0; margin: 20px 0; }
        .mkt-features li { display: flex; align-items: flex-start; gap: 8px; font-size: 0.85rem; color: #374151; padding: 6px 0; line-height: 1.5; }
        .mkt-features li::before { content: "✓"; color: #10B981; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
        .mkt-features li.locked::before { content: "—"; color: #D1D5DB; }
        .mkt-features li.locked { color: #9CA3AF; }

        .mkt-cta { display: block; width: 100%; padding: 12px; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600; cursor: pointer; text-align: center; transition: all 0.15s; }
        .mkt-cta-primary { background: #2563EB; color: #fff; }
        .mkt-cta-primary:hover { background: #1D4ED8; }
        .mkt-cta-outline { background: #fff; color: #2563EB; border: 2px solid #2563EB; }
        .mkt-cta-outline:hover { background: #EFF6FF; }

        .mkt-tooltip { position: relative; cursor: help; border-bottom: 1px dashed #9CA3AF; }
        .mkt-tooltip .mkt-tip { display: none; position: absolute; bottom: 100%; right: 50%; transform: translateX(50%); background: #1F2937; color: #fff; font-size: 0.75rem; padding: 8px 12px; border-radius: 8px; width: 220px; text-align: center; line-height: 1.5; z-index: 10; margin-bottom: 6px; }
        .mkt-tooltip:hover .mkt-tip { display: block; }

        .mkt-compare { margin: 48px 0; }
        .mkt-compare h2 { text-align: center; font-size: 1.5rem; font-weight: 700; margin-bottom: 24px; }
        .mkt-compare-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .mkt-compare-table th { background: #F9FAFB; padding: 10px 12px; text-align: right; font-weight: 600; border-bottom: 2px solid #E5E7EB; }
        .mkt-compare-table td { padding: 10px 12px; border-bottom: 1px solid #F3F4F6; }
        .mkt-compare-table tr:last-child td { border-bottom: none; }
        @media(max-width:600px) { .mkt-compare-table { font-size: 0.75rem; } .mkt-compare-table th, .mkt-compare-table td { padding: 6px 8px; } }

        .mkt-onboard { background: #F9FAFB; border-radius: 16px; padding: 32px; margin: 48px 0; text-align: center; }
        .mkt-onboard h2 { font-size: 1.3rem; font-weight: 700; margin-bottom: 8px; }
        .mkt-onboard p { color: #6B7280; margin-bottom: 24px; }
        .mkt-onboard-steps { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; margin-bottom: 24px; }
        .mkt-ob-step { text-align: center; }
        .mkt-ob-num { width: 36px; height: 36px; border-radius: 50%; background: #2563EB; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 8px; }
        .mkt-ob-label { font-size: 0.82rem; color: #374151; font-weight: 500; }

        .mkt-form { max-width: 480px; margin: 0 auto; text-align: right; }
        .mkt-form select, .mkt-form input { width: 100%; padding: 12px 14px; border: 1.5px solid #E5E7EB; border-radius: 10px; font-size: 0.92rem; margin-bottom: 10px; font-family: inherit; }
        .mkt-form select:focus, .mkt-form input:focus { border-color: #2563EB; outline: none; }
        .mkt-form button { width: 100%; padding: 14px; background: #2563EB; color: #fff; border: none; border-radius: 10px; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: inherit; }
        .mkt-form button:hover { background: #1D4ED8; }

        .mkt-faq { margin: 48px 0; }
        .mkt-faq h2 { text-align: center; font-size: 1.3rem; font-weight: 700; margin-bottom: 24px; }
        .mkt-faq-item { border-bottom: 1px solid #E5E7EB; }
        .mkt-faq-q { padding: 16px 0; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
        .mkt-faq-q::after { content: "+"; font-size: 1.2rem; color: #9CA3AF; }
        .mkt-faq-a { display: none; padding: 0 0 16px; color: #6B7280; font-size: 0.88rem; line-height: 1.7; }
      `}</style>

      <div className="wrap">
        <a href="/" style={{ display: 'inline-block', marginTop: 24, color: '#2563EB', fontSize: '0.88rem', textDecoration: 'none' }}>← חזרה לדף הראשי</a>

        {/* Hero */}
        <div className="mkt-hero">
          <div className="mkt-badge">ניהול שיווק מקצועי</div>
          <h1>AI עושה 80% מהעבודה.<br/>אנחנו עושים את ה-20% שמשנים הכל.</h1>
          <p>
            סוכני AI יוצרים תוכן, מנהלים קמפיינים, מנטרים SEO ומפרסמים — 24/7.
            מומחה אנושי מוודא שהכל עובד, מתקן, ומכוון את האסטרטגיה.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mkt-grid">
          {/* Starter */}
          <div className="mkt-card">
            <div className="mkt-card-icon">🟢</div>
            <div className="mkt-card-name">Starter</div>
            <div className="mkt-card-desc">פיקוח ובקרת איכות על הסוכנים</div>
            <div className="mkt-price">₪299<span>/חודש</span></div>
            <div className="mkt-price-note">+ עלות שרת ClawFlow בנפרד</div>
            <ul className="mkt-features">
              <li><span className="mkt-tooltip">בדיקה שבועית של תוצרי הסוכנים<span className="mkt-tip">כל שבוע נבדוק מה הסוכנים כתבו, נאשר תוכן איכותי ונסנן שגיאות</span></span></li>
              <li><span className="mkt-tooltip">אישור ועריכת תוכן<span className="mkt-tip">תוכן שהסוכן כתב עובר ביקורת אנושית לפני פרסום — בודקים דיוק, טון, ורלוונטיות</span></span></li>
              <li><span className="mkt-tooltip">דוח חודשי — SEO + ביצועים<span className="mkt-tip">דוח שמסכם: מיקומים בגוגל, תנועה אורגנית, ציון AEO, מה שופר ומה צריך תשומת לב</span></span></li>
              <li><span className="mkt-tooltip">תמיכה בטלגרם (24ש בימי עבודה)<span className="mkt-tip">שאלה? בעיה? שלחו הודעה בטלגרם ונענה עד 24 שעות בימי א-ה</span></span></li>
              <li><span className="mkt-tooltip">תיקון תקלות<span className="mkt-tip">אם סוכן נתקע, אינטגרציה נפלה, או משהו לא עובד — אנחנו מתקנים</span></span></li>
              <li><span className="mkt-tooltip">חיבור כלי SEO<span className="mkt-tip">נחבר עבורכם: Google Search Console, DataForSEO, Firecrawl — הכל מוכן לעבודה</span></span></li>
              <li className="locked">יצירת תוכן חדש</li>
              <li className="locked">ניהול פרסום ממומן</li>
            </ul>
            <button className="mkt-cta mkt-cta-outline" onClick={() => {}} id="mkt-cta-starter">בחרו Starter ←</button>
          </div>

          {/* Growth */}
          <div className="mkt-card popular">
            <div className="mkt-popular-tag">הכי פופולרי</div>
            <div className="mkt-card-icon">🔵</div>
            <div className="mkt-card-name">Growth</div>
            <div className="mkt-card-desc">תוכן + פרסום + אופטימיזציה</div>
            <div className="mkt-price">₪699<span>/חודש</span></div>
            <div className="mkt-price-note">+ עלות שרת + ad spend בנפרד</div>
            <ul className="mkt-features">
              <li><span className="mkt-tooltip">הכל מ-Starter<span className="mkt-tip">כל מה שב-Starter כלול גם כאן — פיקוח, בקרה, דוחות, תמיכה</span></span></li>
              <li><span className="mkt-tooltip">מחקר SEO חודשי + אסטרטגיה<span className="mkt-tip">כל חודש נריץ מחקר מילות מפתח, ננתח מתחרים, ונעדכן את תוכנית התוכן</span></span></li>
              <li><span className="mkt-tooltip">עד 4 מאמרים/חודש<span className="mkt-tip">הסוכן כותב, אנחנו עורכים — מאמרי SEO עם Schema, AI Nuggets, ו-Entity Consensus</span></span></li>
              <li><span className="mkt-tooltip">הקמת קמפיינים ממומנים<span className="mkt-tip">נגדיר קמפיינים ב-Meta/Google Ads — קהלי יעד, תקציבים, מסרים. אתם מאשרים</span></span></li>
              <li><span className="mkt-tooltip">עד 8 קריאייטיבים/חודש<span className="mkt-tip">תמונות ווידאו שנוצרים ב-AI ועוברים ביקורת אנושית — לפרסום ממומן ורשתות</span></span></li>
              <li><span className="mkt-tooltip">אופטימיזציה שבועית של מודעות<span className="mkt-tip">כל שבוע נבדוק ביצועים, נכבה מודעות חלשות, נחזק מצליחות, נעדכן תקציבים</span></span></li>
              <li><span className="mkt-tooltip">Prompt Engineering<span className="mkt-tip">נותאם את הוראות הסוכנים (SOUL.md) לעסק שלכם — טון, סגנון, מסרים</span></span></li>
              <li><span className="mkt-tooltip">שיחה כל שבועיים (20 דק)<span className="mkt-tip">שיחת Zoom קצרה — מה עבד, מה לשנות, מה בתוכנית</span></span></li>
            </ul>
            <button className="mkt-cta mkt-cta-primary" onClick={() => {}} id="mkt-cta-growth">בחרו Growth ←</button>
          </div>

          {/* Autopilot */}
          <div className="mkt-card">
            <div className="mkt-card-icon">🟣</div>
            <div className="mkt-card-name">Autopilot</div>
            <div className="mkt-card-desc">שיווק מלא על אוטומט</div>
            <div className="mkt-price">₪1,499<span>/חודש</span></div>
            <div className="mkt-price-note">+ עלות שרת + ad spend בנפרד</div>
            <ul className="mkt-features">
              <li><span className="mkt-tooltip">הכל מ-Growth<span className="mkt-tip">כל מה שב-Growth כלול — מחקר, תוכן, פרסום, אופטימיזציה</span></span></li>
              <li><span className="mkt-tooltip">עד 8 מאמרי SEO/חודש<span className="mkt-tip">כפול ממה שב-Growth — מספיק לבנות סמכות בתחום תוך חודשים</span></span></li>
              <li><span className="mkt-tooltip">עד 16 קריאייטיבים/חודש<span className="mkt-tip">תמונות, וידאו, קרוסלות — לכל ערוץ פרסום</span></span></li>
              <li><span className="mkt-tooltip">ניהול רשתות חברתיות<span className="mkt-tip">LinkedIn + Facebook + Instagram — 3-5 פוסטים בשבוע, מתוזמנים ומותאמים</span></span></li>
              <li><span className="mkt-tooltip">מעקב תחרותי + תגובה מהירה<span className="mkt-tip">מנטרים מה המתחרים עושים ומגיבים תוך 24 שעות עם תוכן רלוונטי</span></span></li>
              <li><span className="mkt-tooltip">עד 2 דפי נחיתה/חודש<span className="mkt-tip">עמודי Landing Page חדשים או שדרוג קיימים — עם SEO ו-Schema מובנים</span></span></li>
              <li><span className="mkt-tooltip">שיחה שבועית (30 דק)<span className="mkt-tip">פגישה שבועית קבועה עם מנהל חשבון ייעודי — סטטוס, תוכניות, החלטות</span></span></li>
              <li><span className="mkt-tooltip">דוח ROAS<span className="mkt-tip">כמה הושקע בפרסום → כמה הכניס. מספרים אמיתיים, לא תחושות</span></span></li>
            </ul>
            <button className="mkt-cta mkt-cta-outline" onClick={() => {}} id="mkt-cta-autopilot">בחרו Autopilot ←</button>
          </div>
        </div>

        {/* Competitor Comparison */}
        <div className="mkt-compare">
          <h2>למה Flowmatic?</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="mkt-compare-table">
              <thead>
                <tr>
                  <th></th>
                  <th>סוכנות שיווק<br/><span style={{fontWeight:400,color:'#9CA3AF'}}>רגילה</span></th>
                  <th>פרילנסר<br/><span style={{fontWeight:400,color:'#9CA3AF'}}>עצמאי</span></th>
                  <th style={{color:'#2563EB'}}>Flowmatic<br/><span style={{fontWeight:400}}>AI + אנושי</span></th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{fontWeight:600}}>הקמה</td><td>₪5,000–15,000</td><td>₪2,000–5,000</td><td style={{color:'#2563EB',fontWeight:600}}>₪500–2,000</td></tr>
                <tr><td style={{fontWeight:600}}>עלות חודשית</td><td>₪5,000–15,000</td><td>₪3,000–8,000</td><td style={{color:'#2563EB',fontWeight:600}}>₪299–1,499</td></tr>
                <tr><td style={{fontWeight:600}}>סוכני AI</td><td>❌ עבודה ידנית</td><td>❌ עבודה ידנית</td><td style={{color:'#10B981'}}>✅ 9 סוכנים 24/7</td></tr>
                <tr><td style={{fontWeight:600}}>מהירות תגובה</td><td>1–2 שבועות</td><td>3–7 ימים</td><td style={{color:'#10B981'}}>✅ שעות</td></tr>
                <tr><td style={{fontWeight:600}}>SEO + AEO</td><td>בסיסי (ידני)</td><td>תלוי במומחיות</td><td style={{color:'#10B981'}}>✅ אוטומטי + אנושי</td></tr>
                <tr><td style={{fontWeight:600}}>פרסום ממומן</td><td>✅ (+ עמלה 15-20%)</td><td>תלוי</td><td style={{color:'#10B981'}}>✅ ללא עמלה על spend</td></tr>
                <tr><td style={{fontWeight:600}}>שקיפות</td><td>דוח חודשי</td><td>לפי בקשה</td><td style={{color:'#10B981'}}>✅ Dashboard חי 24/7</td></tr>
                <tr><td style={{fontWeight:600}}>יצירת תוכן</td><td>2–4 פוסטים/שבוע</td><td>1–2 פוסטים/שבוע</td><td style={{color:'#10B981'}}>✅ עד 16 קריאייטיבים/חודש</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* How it works */}
        <div className="mkt-onboard">
          <h2>איך מתחילים?</h2>
          <p>תהליך פשוט — תוך יום עבודה הכל רץ</p>
          <div className="mkt-onboard-steps">
            <div className="mkt-ob-step">
              <div className="mkt-ob-num">1</div>
              <div className="mkt-ob-label">בוחרים חבילה</div>
            </div>
            <div className="mkt-ob-step">
              <div className="mkt-ob-num">2</div>
              <div className="mkt-ob-label">שיחת הכרות (15 דק)</div>
            </div>
            <div className="mkt-ob-step">
              <div className="mkt-ob-num">3</div>
              <div className="mkt-ob-label">מגדירים פרופיל + כלים</div>
            </div>
            <div className="mkt-ob-step">
              <div className="mkt-ob-num">4</div>
              <div className="mkt-ob-label">הסוכנים עובדים 🚀</div>
            </div>
          </div>

          {/* Form */}
          <div className="mkt-form" id="mkt-form">
            <select id="mkt-package">
              <option value="starter">Starter — ₪299/חודש</option>
              <option value="growth" selected>Growth — ₪699/חודש (מומלץ)</option>
              <option value="autopilot">Autopilot — ₪1,499/חודש</option>
            </select>
            <input type="tel" id="mkt-phone" placeholder="טלפון" dir="ltr" />
            <input type="text" id="mkt-name" placeholder="שם (לא חובה)" />
            <button id="mkt-submit">שלחו בקשה ←</button>
            <div id="mkt-success" style={{ display: 'none', textAlign: 'center', padding: 16, color: '#059669', fontWeight: 600 }}>
              ✅ הבקשה נשלחה! נחזור אליכם בהקדם.
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mkt-faq" id="mkt-faq">
          <h2>שאלות נפוצות</h2>
          <div className="mkt-faq-item">
            <div className="mkt-faq-q" onClick={(e) => { const a = (e.currentTarget.nextElementSibling as HTMLElement); a.style.display = a.style.display === 'block' ? 'none' : 'block' }}>מה ההבדל בין ClawFlow לבין ניהול שיווק?</div>
            <div className="mkt-faq-a">ClawFlow הוא השרת עם סוכני ה-AI. ניהול שיווק הוא שירות אנושי שמוודא שהסוכנים עובדים נכון, מתקן שגיאות, מכוון אסטרטגיה, ומייצר תוכן איכותי. אפשר להשתמש ב-ClawFlow בלי ניהול שיווק — אבל עם ניהול, התוצאות טובות יותר.</div>
          </div>
          <div className="mkt-faq-item">
            <div className="mkt-faq-q" onClick={(e) => { const a = (e.currentTarget.nextElementSibling as HTMLElement); a.style.display = a.style.display === 'block' ? 'none' : 'block' }}>מה עם תקציב הפרסום (ad spend)?</div>
            <div className="mkt-faq-a">תקציב הפרסום ב-Meta/Google נפרד ומשולם ישירות על ידכם. אנחנו לא גובים עמלה על ה-spend — רק את דמי הניהול. נמליץ על תקציב מתאים בשיחת ההכרות.</div>
          </div>
          <div className="mkt-faq-item">
            <div className="mkt-faq-q" onClick={(e) => { const a = (e.currentTarget.nextElementSibling as HTMLElement); a.style.display = a.style.display === 'block' ? 'none' : 'block' }}>כמה זמן לוקח לראות תוצאות?</div>
            <div className="mkt-faq-a">פרסום ממומן — תוצאות ראשונות תוך 1-2 שבועות. SEO אורגני — 2-4 חודשים לתנועה משמעותית. AEO (נראות ב-AI) — 3-6 חודשים. כל חודש תקבלו דוח עם מספרים אמיתיים.</div>
          </div>
          <div className="mkt-faq-item">
            <div className="mkt-faq-q" onClick={(e) => { const a = (e.currentTarget.nextElementSibling as HTMLElement); a.style.display = a.style.display === 'block' ? 'none' : 'block' }}>אפשר להחליף חבילה?</div>
            <div className="mkt-faq-a">כן, אפשר לשדרג או לצמצם בכל חודש. ללא התחייבות.</div>
          </div>
          <div className="mkt-faq-item">
            <div className="mkt-faq-q" onClick={(e) => { const a = (e.currentTarget.nextElementSibling as HTMLElement); a.style.display = a.style.display === 'block' ? 'none' : 'block' }}>מה אני צריך לעשות?</div>
            <div className="mkt-faq-a">ב-Starter: לאשר תוכן פעם בשבוע. ב-Growth: לאשר + להשתתף בשיחה כל שבועיים. ב-Autopilot: רק לאשר — אנחנו עושים הכל.</div>
          </div>
        </div>
      </div>

      {/* Form submission script */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', function() {
          // CTA buttons scroll to form
          ['starter', 'growth', 'autopilot'].forEach(function(plan) {
            var btn = document.getElementById('mkt-cta-' + plan);
            if (btn) btn.addEventListener('click', function() {
              document.getElementById('mkt-package').value = plan;
              document.getElementById('mkt-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
              document.getElementById('mkt-phone').focus();
            });
          });

          // Submit
          document.getElementById('mkt-submit').addEventListener('click', function() {
            var phone = document.getElementById('mkt-phone').value.trim();
            var name = document.getElementById('mkt-name').value.trim();
            var pkg = document.getElementById('mkt-package').value;
            if (!phone) { alert('נא למלא טלפון'); return; }
            var btn = document.getElementById('mkt-submit');
            btn.disabled = true; btn.textContent = 'שולח...';
            var pkgNames = { starter: 'Starter ₪299', growth: 'Growth ₪699', autopilot: 'Autopilot ₪1,499' };
            fetch('https://api.clawflow.flowmatic.co.il/hosting/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: name || 'לא צוין',
                phone: phone,
                type: 'ניהול שיווק — ' + (pkgNames[pkg] || pkg),
                message: 'בקשת ניהול שיווק: ' + (pkgNames[pkg] || pkg)
              })
            }).then(function() {
              document.getElementById('mkt-success').style.display = '';
              btn.style.display = 'none';
            }).catch(function() {
              btn.disabled = false; btn.textContent = 'שלחו בקשה ←';
              alert('שגיאה בשליחה, נסו שוב');
            });
          });
        });
      `}} />
    </>
  )
}
