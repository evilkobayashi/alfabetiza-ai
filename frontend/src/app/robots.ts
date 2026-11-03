import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/sala', '/aula-interativa', '/onboarding', '/pagamento', '/api'],
    },
    sitemap: 'https://alfabetiza.aitecnologia.xyz/sitemap.xml',
  }
}
