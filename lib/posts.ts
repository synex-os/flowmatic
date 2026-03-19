import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const POSTS_DIR = path.join(process.cwd(), 'content/guides')

export interface PostMeta {
  title: string
  title_en: string
  slug: string
  description: string
  date_created: string
  date_updated: string
  level: 'base' | 'pro' | 'expert' | 'system'
  topic: string
  persona: string[]
  youtube_video?: string
  youtube_timestamp?: string
  affiliate_links: boolean
  series?: string
  series_position?: number
  next_level_slug?: string
  prev_level_slug?: string
  related: string[]
  tags: string[]
  reading_time: string
  featured?: boolean
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'))
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
    const { data, content } = matter(raw)
    const rt = readingTime(content)
    return {
      ...data,
      slug: data.slug || file.replace(/\.mdx$/, ''),
      reading_time: `${Math.ceil(rt.minutes)} דקות קריאה`,
      related: data.related || [],
      tags: data.tags || [],
      persona: data.persona || ['any'],
      affiliate_links: data.affiliate_links || false,
    } as PostMeta
  })
  return posts.sort(
    (a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
  )
}

export function getPostBySlug(slug: string) {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'))
  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
    const { data, content } = matter(raw)
    const postSlug = data.slug || file.replace(/\.mdx$/, '')
    if (postSlug === slug) {
      const rt = readingTime(content)
      return {
        meta: {
          ...data,
          slug: postSlug,
          reading_time: `${Math.ceil(rt.minutes)} דקות קריאה`,
          related: data.related || [],
          tags: data.tags || [],
          persona: data.persona || ['any'],
          affiliate_links: data.affiliate_links || false,
        } as PostMeta,
        content,
      }
    }
  }
  return null
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
      const { data } = matter(raw)
      return data.slug || file.replace(/\.mdx$/, '')
    })
}
