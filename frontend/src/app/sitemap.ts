import type { MetadataRoute } from 'next'

const BASE = 'https://alfabetiza.aitecnologia.xyz'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/login', '/signup', '/privacidade', '/termos']
  const now = new Date()
  return routes.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: now,
    changeFrequency: r === '' ? 'weekly' : 'monthly',
    priority: r === '' ? 1.0 : 0.7,
  }))
}
