import React from 'react'

const LEVEL_LABELS: Record<string, { emoji: string; label: string; color: string }> = {
  base: { emoji: '📗', label: 'הדרך הפשוטה', color: '#2A7A4B' },
  pro: { emoji: '📘', label: 'הדרך הנכונה', color: '#2563EB' },
  expert: { emoji: '📙', label: 'הדרך המקצועית', color: '#D97706' },
  system: { emoji: '🔁', label: 'ניטור ואנליטיקה', color: '#7C3AED' },
}

export function LevelBadge({ level }: { level: string }) {
  const l = LEVEL_LABELS[level] || LEVEL_LABELS.base
  return (
    <span className="level-badge" style={{ '--level-color': l.color } as React.CSSProperties}>
      {l.emoji} {l.label}
    </span>
  )
}

export function Tip({ children }: { children: React.ReactNode }) {
  return <div className="callout callout-tip"><span className="callout-icon">💡</span><div className="callout-body"><strong>טיפ</strong>{children}</div></div>
}

export function Warning({ children }: { children: React.ReactNode }) {
  return <div className="callout callout-warning"><span className="callout-icon">⚠️</span><div className="callout-body"><strong>שימו לב</strong>{children}</div></div>
}

export function Critical({ children }: { children: React.ReactNode }) {
  return <div className="callout callout-critical"><span className="callout-icon">🔴</span><div className="callout-body"><strong>חשוב</strong>{children}</div></div>
}

export function AffiliateLink({ href, name, children }: { href: string; name: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer sponsored" className="affiliate-link">
      {name} <span className="aff-badge">אפיליאט</span>
      <span className="aff-desc">{children}</span>
    </a>
  )
}

export function IsraelNote({ children }: { children: React.ReactNode }) {
  return <div className="callout callout-israel"><span className="callout-icon">🇮🇱</span><div className="callout-body"><strong>ישראל</strong>{children}</div></div>
}

export function ScreenPlaceholder({ alt, description }: { alt: string; description: string }) {
  return (
    <div className="screen-placeholder">
      <div className="screen-placeholder-inner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <div className="screen-placeholder-alt">{alt}</div>
        <div className="screen-placeholder-desc">{description}</div>
      </div>
    </div>
  )
}

export function YouTubeEmbed({ videoId, timestamp }: { videoId: string; timestamp?: string }) {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}${timestamp ? `?start=${timeToSeconds(timestamp)}` : ''}`
  return (
    <div className="yt-embed">
      <iframe
        src={src}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}

export function YouTubeTimestamp({ videoId, time, label }: { videoId: string; time: string; label: string }) {
  const seconds = timeToSeconds(time)
  return (
    <a
      href={`https://www.youtube.com/watch?v=${videoId}&t=${seconds}s`}
      target="_blank"
      rel="noopener noreferrer"
      className="yt-timestamp"
    >
      ▶ {label}
    </a>
  )
}

export function AdvancedInsert({
  level,
  title,
  teaser,
  cta_text,
  cta_href,
}: {
  level: string
  title: string
  teaser: string
  cta_text?: string
  cta_href: string
}) {
  const l = LEVEL_LABELS[level] || LEVEL_LABELS.pro
  return (
    <div className="advanced-insert" style={{ '--level-color': l.color } as React.CSSProperties}>
      <div className="advanced-insert-badge">{l.emoji} {l.label}</div>
      <h4 className="advanced-insert-title">{title}</h4>
      <p className="advanced-insert-teaser">{teaser}</p>
      <a href={cta_href} className="advanced-insert-cta">{cta_text || `המדריך המלא — ${l.label}`} ←</a>
    </div>
  )
}

export function LevelNav({
  current,
  baseSlug,
  proSlug,
  expertSlug,
  systemSlug,
}: {
  current: string
  baseSlug?: string
  proSlug?: string
  expertSlug?: string
  systemSlug?: string
}) {
  const levels = [
    { key: 'base', slug: baseSlug, ...LEVEL_LABELS.base },
    { key: 'pro', slug: proSlug, ...LEVEL_LABELS.pro },
    { key: 'expert', slug: expertSlug, ...LEVEL_LABELS.expert },
    { key: 'system', slug: systemSlug, ...LEVEL_LABELS.system },
  ].filter((l) => l.slug)

  return (
    <nav className="level-nav">
      {levels.map((l) => (
        <a
          key={l.key}
          href={`/blog/${l.slug}/`}
          className={`level-nav-item${l.key === current ? ' active' : ''}`}
        >
          {l.emoji} {l.label}
        </a>
      ))}
    </nav>
  )
}

function timeToSeconds(time: string): number {
  const parts = time.split(':').map(Number)
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return 0
}

export const mdxComponents = {
  Tip,
  Warning,
  Critical,
  AffiliateLink,
  IsraelNote,
  ScreenPlaceholder,
  YouTubeEmbed,
  YouTubeTimestamp,
  AdvancedInsert,
  LevelNav,
  LevelBadge,
}
