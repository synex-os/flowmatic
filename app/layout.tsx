import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://flowmatic.co.il'),
  title: {
    default: 'Flowmatic — סוכן AI לעסקים | מדריכים ל-OpenClaw בעברית',
    template: '%s | Flowmatic',
  },
  description: 'סוכן AI לעסקים ישראלים — מדריכים מעשיים ל-OpenClaw בעברית, אוטומציה עם בינה מלאכותית, אירוח VPS מוכן תוך 3 דקות. הכל חינמי, ללא paywall.',
  keywords: [
    'סוכן AI', 'סוכן AI לעסקים', 'סוכן בינה מלאכותית',
    'OpenClaw', 'OpenClaw ישראל', 'OpenClaw עברית', 'OpenClaw מדריך',
    'בינה מלאכותית לעסקים', 'בינה מלאכותית לעסקים קטנים', 'AI לעסקים ישראלים',
    'אוטומציה עם AI', 'אוטומציה עסקית', 'אוטומציה בינה מלאכותית',
    'AI agent', 'AI agent Israel', 'AI assistant Hebrew',
    'שיווק עם AI', 'סוכן שיווק אוטומטי', 'AI marketing agent',
    'Claude API', 'Claude לעסקים',
    'n8n', 'Activepieces', 'אוטומציות open source',
  ],
  authors: [{ name: 'Flowmatic', url: 'https://flowmatic.co.il' }],
  creator: 'Flowmatic',
  publisher: 'Flowmatic',
  alternates: {
    canonical: 'https://flowmatic.co.il/',
  },
  openGraph: {
    title: 'Flowmatic — סוכן AI לעסקים | מדריכים ל-OpenClaw בעברית',
    description: 'סוכן AI לעסקים ישראלים — מדריכים ל-OpenClaw, אוטומציה עם בינה מלאכותית, אירוח VPS מוכן תוך 3 דקות. חינמי, בעברית.',
    url: 'https://flowmatic.co.il',
    siteName: 'Flowmatic',
    locale: 'he_IL',
    type: 'website',
    images: [{
      url: 'https://flowmatic.co.il/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Flowmatic — המדריך הישראלי ל-OpenClaw',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flowmatic — סוכן AI לעסקים | OpenClaw בעברית',
    description: 'סוכן AI לעסקים ישראלים — מדריכים, אוטומציה, אירוח VPS. חינמי, בעברית.',
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
        {children}
        <Script
          defer
          data-domain="flowmatic.co.il"
          src="https://plausible.io/js/pa-aAqBMAznLkSKHIgdDIawd.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};`}
        </Script>
      </body>
    </html>
  )
}
