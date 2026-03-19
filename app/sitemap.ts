import { MetadataRoute } from 'next'
import { getAllPosts } from '../lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://flowmatic.co.il'
  const posts = getAllPosts()

  const blogEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.date_updated),
    changeFrequency: 'weekly' as const,
    priority: post.featured ? 0.9 : 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...blogEntries,
  ]
}
