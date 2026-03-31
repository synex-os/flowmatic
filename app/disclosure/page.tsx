import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'גילוי נאות',
  description: 'גילוי נאות — Flowmatic משתמשת בלינקי אפיליאט. מידע מלא על מקורות ההכנסה, שקיפות והמלצות.',
  alternates: { canonical: 'https://flowmatic.co.il/disclosure' },
}

export default function Disclosure() {
  return (
    <div className="legal-wrap">
      <a href="/" className="legal-back">← חזרה לדף הראשי</a>
      <h1>גילוי נאות</h1>
      <p className="legal-subtitle">עדכון אחרון: מרץ 2026 · Flowmatic</p>

      <h2>1. מי אנחנו</h2>
      <p>Flowmatic (ע.מ. 324503853) מפעילה את אתר flowmatic.co.il — מדריכים וכלים ל-OpenClaw בעברית. Flowmatic מפעילה גם את שירות ClawFlow — אירוח סוכני AI.</p>

      <h2>2. מקורות הכנסה</h2>
      <p>Flowmatic מרוויחה מהמקורות הבאים:</p>
      <ul>
        <li><strong>לינקי אפיליאט</strong> — כשאתם נרשמים לשירות דרך לינק באתר (למשל Hostinger, ElevenLabs), אנחנו מקבלים עמלה. זה לא עולה לכם יותר.</li>
        <li><strong>ClawFlow</strong> — שירות אירוח סוכני AI בתשלום חודשי.</li>
        <li><strong>Human as a Service</strong> — עזרה אישית בהגדרת OpenClaw, בתשלום לפי מקרה.</li>
      </ul>

      <h2>3. סימון לינקי אפיליאט</h2>
      <p>כל לינק אפיליאט באתר מסומן בגלוי עם תגית &quot;אפיליאט&quot; ליד הכלי המומלץ. אנחנו לא מסתירים את העובדה שמדובר בהמלצה שמניבה לנו הכנסה.</p>

      <h2>4. אובייקטיביות</h2>
      <p>ההמלצות שלנו מבוססות על שימוש אישי ובדיקה מעשית. אנחנו לא ממליצים על כלי רק כי יש לו תוכנית אפיליאט. אם כלי לא טוב — הוא לא מופיע באתר, גם אם הוא משלם עמלות.</p>

      <h2>5. מוצרים שלנו</h2>
      <p>ClawFlow הוא מוצר שלנו. כשאנחנו מזכירים אותו — זו המלצה על מוצר שאנחנו בנינו ומפעילים. זה תמיד מסומן כ&quot;שלנו&quot;.</p>

      <h2>6. תוכן חינמי</h2>
      <p>כל המדריכים והתוכן באתר חינמיים לחלוטין, ללא paywall. מודל ההכנסה מאפשר לנו להמשיך לייצר תוכן איכותי בעברית.</p>

      <h2>7. יצירת קשר</h2>
      <p>שאלות או דאגות לגבי גילוי נאות? <a href="mailto:support@flowmatic.co.il">support@flowmatic.co.il</a></p>

      <h2>8. מסמכים נוספים</h2>
      <ul>
        <li><a href="/privacy">מדיניות פרטיות</a></li>
        <li><a href="/contact">יצירת קשר</a></li>
      </ul>
    </div>
  )
}
