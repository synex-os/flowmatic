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

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) =>
    `<pre><code>${escapeHtml(code.trim())}</code></pre>`)

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')

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
