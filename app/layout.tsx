import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://flowmatic.co.il'),
  title: {
    default: 'Flowmatic — המדריך הישראלי ל-OpenClaw',
    template: '%s | Flowmatic',
  },
  description: 'המשאב הישראלי הראשון ל-OpenClaw. מדריכים מעשיים, כלים מומלצים, ועזרה אישית — הכל חינמי, בעברית. סוכן AI לעסקים ישראלים.',
  keywords: ['OpenClaw', 'OpenClaw ישראל', 'OpenClaw עברית', 'סוכן AI', 'AI agent', 'OpenClaw מדריך', 'OpenClaw הגדרה', 'בינה מלאכותית לעסקים', 'AI לעסקים ישראלים'],
  authors: [{ name: 'Flowmatic', url: 'https://flowmatic.co.il' }],
  creator: 'Flowmatic',
  publisher: 'Flowmatic',
  alternates: {
    canonical: 'https://flowmatic.co.il/',
  },
  openGraph: {
    title: 'Flowmatic — המדריך הישראלי ל-OpenClaw',
    description: 'המשאב הישראלי הראשון ל-OpenClaw. מדריכים מעשיים, כלים מומלצים, ועזרה אישית — הכל חינמי, בעברית.',
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
    title: 'Flowmatic — המדריך הישראלי ל-OpenClaw',
    description: 'מדריכים מעשיים ל-OpenClaw בעברית. חינמי, ללא paywall.',
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
  description: 'המשאב הישראלי הראשון ל-OpenClaw — מדריכים, כלים ועזרה אישית בעברית',
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
