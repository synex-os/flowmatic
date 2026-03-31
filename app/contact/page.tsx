import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'יצירת קשר',
  description: 'צרו קשר עם Flowmatic — שאלות על OpenClaw, עזרה טכנית, שיתופי פעולה או כל נושא אחר.',
  alternates: { canonical: 'https://flowmatic.co.il/contact' },
}

export default function Contact() {
  return (
    <div className="legal-wrap">
      <a href="/" className="legal-back">← חזרה לדף הראשי</a>
      <h1>יצירת קשר</h1>
      <p className="legal-subtitle">Flowmatic · שלמה המלך 18, נתניה, ישראל</p>

      <h2>אימייל</h2>
      <p>לכל שאלה, בקשה או הצעת שיתוף פעולה:</p>
      <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
        <a href="mailto:support@flowmatic.co.il">support@flowmatic.co.il</a>
      </p>
      <p>זמן תגובה ממוצע: עד 24 שעות בימי עבודה.</p>

      <h2>עזרה אישית (Human as a Service)</h2>
      <p>צריכים עזרה בהגדרת OpenClaw? נתקעתם עם שגיאה? רוצים שמישהו יעשה את זה בשבילכם?</p>
      <p>מלאו את <a href="/#has">טופס הבקשה</a> באתר הראשי — ונחזור עם הצעה מותאמת.</p>

      <h2>ClawFlow — תמיכה טכנית</h2>
      <p>לקוחות ClawFlow — לתמיכה טכנית בנושאי שרת, אינטגרציות או חיוב:</p>
      <p><a href="mailto:support@flowmatic.co.il">support@flowmatic.co.il</a> עם מזהה ה-Instance שלכם.</p>

      <h2>שיתופי פעולה</h2>
      <p>מעוניינים בשיתוף פעולה, כתבה משותפת, או אינטגרציה? נשמח לשמוע — שלחו מייל עם הצעה קצרה.</p>

      <h2>פרטי העסק</h2>
      <ul>
        <li><strong>שם:</strong> Flowmatic</li>
        <li><strong>ע.מ.:</strong> 324503853</li>
        <li><strong>כתובת:</strong> שלמה המלך 18, נתניה, ישראל</li>
        <li><strong>אימייל:</strong> <a href="mailto:support@flowmatic.co.il">support@flowmatic.co.il</a></li>
      </ul>
    </div>
  )
}
