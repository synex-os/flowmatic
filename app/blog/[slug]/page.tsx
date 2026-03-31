import { getAllSlugs, getPostBySlug } from '../../../lib/posts'
import { notFound } from 'next/navigation'
import { MDXRemote } from '../../../components/mdx-remote-wrapper'
import { Metadata } from 'next'
import '../../../components/blog-styles.css'

const LEVEL_LABELS: Record<string, { emoji: string; label: string; color: string }> = {
  base: { emoji: '📗', label: 'הדרך הפשוטה', color: '#2A7A4B' },
  pro: { emoji: '📘', label: 'הדרך הנכונה', color: '#2563EB' },
  expert: { emoji: '📙', label: 'הדרך המקצועית', color: '#D97706' },
  system: { emoji: '🔁', label: 'ניטור ואנליטיקה', color: '#7C3AED' },
}

const TOPIC_LABELS: Record<string, string> = {
  setup: 'הגדרה',
  security: 'אבטחה',
  integrations: 'אינטגרציות',
  skills: 'Skills',
  memory: 'זיכרון',
  automations: 'אוטומציות',
  models: 'מודלים',
  agents: 'סוכנים',
  gtm: 'GTM',
  marketing: 'שיווק',
  research: 'מחקר',
  updates: 'עדכונים',
  questions: 'שאלות',
}

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  const { meta } = post

  return {
    title: `${meta.title} | Flowmatic`,
    description: meta.description,
    alternates: {
      canonical: `https://flowmatic.co.il/blog/${meta.slug}/`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://flowmatic.co.il/blog/${meta.slug}/`,
      siteName: 'Flowmatic',
      locale: 'he_IL',
      type: 'article',
      publishedTime: meta.date_created,
      modifiedTime: meta.date_updated,
      authors: ['Flowmatic'],
      tags: meta.tags,
      images: [{
        url: 'https://flowmatic.co.il/og-image.png',
        width: 1200,
        height: 630,
        alt: meta.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['https://flowmatic.co.il/og-image.png'],
    },
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) return notFound()

  const { meta, content } = post
  const level = LEVEL_LABELS[meta.level] || LEVEL_LABELS.base

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: meta.title,
    description: meta.description,
    datePublished: meta.date_created,
    dateModified: meta.date_updated,
    author: {
      '@type': 'Organization',
      name: 'Flowmatic',
      url: 'https://flowmatic.co.il',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Flowmatic',
      url: 'https://flowmatic.co.il',
    },
    inLanguage: 'he',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://flowmatic.co.il/blog/${meta.slug}/`,
    },
  }

  const faqItems = extractFAQ(content)
  const faqJsonLd = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div className="post-header">
        <div className="wrap">
          <div className="post-breadcrumb">
            <a href="/">ראשי</a>
            <span>›</span>
            <a href="/blog/">מדריכים</a>
            <span>›</span>
            <span>{TOPIC_LABELS[meta.topic] || meta.topic}</span>
          </div>
          <h1>{meta.title}</h1>
          <div className="post-meta-row">
            <span className="level-badge" style={{ '--level-color': level.color } as React.CSSProperties}>
              {level.emoji} {level.label}
            </span>
            <span>{meta.reading_time}</span>
            <span>עודכן: {meta.date_updated}</span>
            {meta.affiliate_links && <span className="aff-badge">מכיל לינקי אפיליאט</span>}
          </div>
        </div>
      </div>

      <div className="wrap">
        <article className="post-body">
          <MDXRemote source={content} />
        </article>
      </div>
    </>
  )
}

function extractFAQ(content: string) {
  const faq: { question: string; answer: string }[] = []
  const lines = content.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('## ') && line.includes('?')) {
      const question = line.replace('## ', '')
      let answer = ''
      for (let j = i + 1; j < lines.length; j++) {
        const next = lines[j].trim()
        if (next.startsWith('## ') || next.startsWith('# ')) break
        if (next && !next.startsWith('<') && !next.startsWith('```')) {
          answer = next
          break
        }
      }
      if (answer) faq.push({ question, answer })
    }
  }
  return faq
}
