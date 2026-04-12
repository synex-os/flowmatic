'use client'

import React from 'react'
import { mdxComponents } from './mdx-components'

// Simple MDX-like renderer for static export
// Converts markdown content to React elements with custom components
export function MDXRemote({ source }: { source: string }) {
  const html = markdownToHtml(source)
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function markdownToHtml(md: string): string {
  let html = md
    // Remove frontmatter if any leaked
    .replace(/^---[\s\S]*?---\n*/m, '')

  // Custom components → HTML
  html = html
    .replace(/<Tip>([\s\S]*?)<\/Tip>/g, (_m, c) =>
      `<div class="callout callout-tip"><span class="callout-icon">💡</span><div class="callout-body"><strong>טיפ</strong>${processInline(c.trim())}</div></div>`)
    .replace(/<Warning>([\s\S]*?)<\/Warning>/g, (_m, c) =>
      `<div class="callout callout-warning"><span class="callout-icon">⚠️</span><div class="callout-body"><strong>שימו לב</strong>${processInline(c.trim())}</div></div>`)
    .replace(/<Critical>([\s\S]*?)<\/Critical>/g, (_m, c) =>
      `<div class="callout callout-critical"><span class="callout-icon">🔴</span><div class="callout-body"><strong>חשוב</strong>${processInline(c.trim())}</div></div>`)
    .replace(/<IsraelNote>([\s\S]*?)<\/IsraelNote>/g, (_m, c) =>
      `<div class="callout callout-israel"><span class="callout-icon">🇮🇱</span><div class="callout-body"><strong>ישראל</strong>${processInline(c.trim())}</div></div>`)
    .replace(/<ScreenPlaceholder\s+alt="([^"]*)"\s+description="([^"]*)"\s*\/>/g, (_m, alt, desc) =>
      `<div class="screen-placeholder"><div class="screen-placeholder-inner"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><div class="screen-placeholder-alt">${alt}</div><div class="screen-placeholder-desc">${desc}</div></div></div>`)
    .replace(/<YouTubeEmbed\s+videoId="([^"]+)"(?:\s+timestamp="([^"]*)")?\s*\/>/g, (_m, id, ts) => {
      const src = `https://www.youtube-nocookie.com/embed/${id}${ts ? `?start=${ts}` : ''}`
      return `<div class="yt-embed"><iframe src="${src}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe></div>`
    })

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) =>
    `<pre><code>${escapeHtml(code.trim())}</code></pre>`)

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Headers (H2 gets id for anchor links)
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, (_m, text) => {
    const id = text
      .replace(/\*\*/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/[^\u0590-\u05FFa-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()
    return `<h2 id="${id}">${text}</h2>`
  })

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

  // Blockquote
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')

  // Ordered lists
  html = html.replace(/(?:^\d+\. .+\n?)+/gm, (block) => {
    const items = block.trim().split('\n').map(line => `<li>${line.replace(/^\d+\. /, '')}</li>`).join('')
    return `<ol>${items}</ol>`
  })

  // Unordered lists
  html = html.replace(/(?:^- .+\n?)+/gm, (block) => {
    const items = block.trim().split('\n').map(line => `<li>${line.replace(/^- /, '')}</li>`).join('')
    return `<ul>${items}</ul>`
  })

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr/>')

  // Paragraphs — wrap remaining text lines
  html = html.split('\n\n').map(block => {
    const trimmed = block.trim()
    if (!trimmed) return ''
    if (trimmed.startsWith('<')) return trimmed
    return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`
  }).join('\n')

  return html
}

function processInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
