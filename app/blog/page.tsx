import { getAllPosts } from '../../lib/posts'
import Link from 'next/link'
import { Metadata } from 'next'
import '../../components/blog-styles.css'

export const metadata: Metadata = {
  title: 'בלוג — מדריכים ל-OpenClaw בעברית | Flowmatic',
  description: 'מדריכים מעשיים ומעודכנים ל-OpenClaw בעברית. הגדרה, אבטחה, אינטגרציות, אוטומציות וכלים — הכל חינמי, ללא paywall.',
  alternates: {
    canonical: 'https://flowmatic.co.il/blog/',
  },
}

const LEVEL_LABELS: Record<string, { emoji: string; label: string }> = {
  base: { emoji: '📗', label: 'הדרך הפשוטה' },
  pro: { emoji: '📘', label: 'הדרך הנכונה' },
  expert: { emoji: '📙', label: 'הדרך המקצועית' },
  system: { emoji: '🔁', label: 'ניטור ואנליטיקה' },
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

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <div className="blog-hero">
        <div className="wrap">
          <div className="eyebrow">בלוג</div>
          <h1>מדריכים ל-OpenClaw בעברית</h1>
          <p className="sub">
            כל המדריכים מעשיים, מעודכנים, ועם צילומי מסך מלאים. מסודרים לפי רמות — מההתחלה ועד מערכת מתקדמת.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          {posts.length === 0 ? (
            <p style={{ color: 'var(--ink-3)' }}>מאמרים בקרוב...</p>
          ) : (
            <div className="blog-grid">
              {posts.map((post, i) => {
                const level = LEVEL_LABELS[post.level] || LEVEL_LABELS.base
                return (
                  <Link
                    href={`/blog/${post.slug}/`}
                    key={post.slug}
                    className={`blog-card${i === 0 ? ' featured' : ''}`}
                  >
                    <div className="blog-card-head">
                      <span className="level-badge" style={{ '--level-color': post.level === 'base' ? '#2A7A4B' : post.level === 'pro' ? '#2563EB' : post.level === 'expert' ? '#D97706' : '#7C3AED' } as React.CSSProperties}>
                        {level.emoji} {level.label}
                      </span>
                      <span className="blog-card-topic">{TOPIC_LABELS[post.topic] || post.topic}</span>
                    </div>
                    <div className="blog-card-title">{post.title}</div>
                    <div className="blog-card-desc">{post.description}</div>
                    <div className="blog-card-foot">
                      <span>{post.reading_time} · עודכן {post.date_updated}</span>
                      <span className="guide-read">קראו ←</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
