import type { Metadata } from 'next'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://flowmatic.co.il'),
  title: {
    default: 'Flowmatic Academy — קורס שיווק עם AI | ClawFlow Mastery',
    template: '%s | Flowmatic Academy',
  },
  description: 'הקורס הראשון בישראל שמלמד שיווק דיגיטלי עם סוכני AI — על פלטפורמת ClawFlow. מסלול בסיסי ₪199 לבעלי עסקים, מסלול מתקדם ₪1,499 למשווקים. 100% בעברית.',
  keywords: [
    'קורס שיווק AI', 'קורס בינה מלאכותית', 'קורס ClawFlow', 'קורס OpenClaw',
    'שיווק עם AI', 'שיווק דיגיטלי AI', 'שיווק אוטומטי', 'סוכן שיווק AI',
    'קורס דיגיטל מרקטינג', 'קורס לבעלי עסקים', 'קורס למשווקים',
    'MATEH', 'סוכני AI לשיווק', 'אוטומציה שיווקית',
    'Flowmatic Academy', 'Flowmatic קורס',
    'ניהול שיווק AI', 'SMB AI', 'AI לעסקים ישראלים',
    'Claude API', 'LiteLLM', 'DataForSEO',
  ],
  authors: [{ name: 'Flowmatic', url: 'https://flowmatic.co.il' }],
  creator: 'Flowmatic',
  publisher: 'Flowmatic',
  alternates: {
    canonical: 'https://flowmatic.co.il/',
  },
  openGraph: {
    title: 'Flowmatic Academy — קורס שיווק עם AI | ClawFlow Mastery',
    description: 'הקורס הראשון בישראל לשיווק דיגיטלי עם סוכני AI על פלטפורמת ClawFlow. בסיסי ₪199 · מתקדם ₪1,499. 100% בעברית, גישה לכל החיים.',
    url: 'https://flowmatic.co.il',
    siteName: 'Flowmatic Academy',
    locale: 'he_IL',
    type: 'website',
    images: [{
      url: 'https://flowmatic.co.il/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Flowmatic Academy — קורס שיווק עם AI',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flowmatic Academy — קורס שיווק עם AI',
    description: 'הקורס הראשון בישראל לשיווק דיגיטלי עם סוכני AI על פלטפורמת ClawFlow. בסיסי ₪199 · מתקדם ₪1,499.',
    images: ['https://flowmatic.co.il/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Flowmatic',
  alternateName: 'פלומטיק',
  url: 'https://flowmatic.co.il',
  description: 'סוכן AI לעסקים ישראלים — מדריכים ל-OpenClaw, אוטומציה עם בינה מלאכותית, כלים מומלצים ועזרה אישית בעברית',
  inLanguage: 'he',
  publisher: {
    '@type': 'Organization',
    name: 'Flowmatic',
    url: 'https://flowmatic.co.il',
    logo: {
      '@type': 'ImageObject',
      url: 'https://flowmatic.co.il/logo.png',
    },
  },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Flowmatic',
  url: 'https://flowmatic.co.il',
  logo: 'https://flowmatic.co.il/logo.png',
  sameAs: [
    'https://youtube.com/@OpenClawIsrael',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: ['Hebrew', 'English'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://flowmatic.co.il/" />
        <script defer data-domain="flowmatic.co.il" src="https://plausible.io/js/script.js"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
