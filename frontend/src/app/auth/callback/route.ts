import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/onboarding'

  // Resolve canonical origin behind Vercel reverse proxy
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  const origin = forwardedHost 
    ? `${forwardedProto}://${forwardedHost}` 
    : requestUrl.origin

  if (code) {
    const cookieStore = await cookies()
    const redirectResponse = NextResponse.redirect(`${origin}${next}`)

    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseUrl = (rawUrl && !rawUrl.includes('kayovfwqqkmuvgnogtwv')) ? rawUrl : 'https://ueybwjekfxxoyqjisfsj.supabase.co'
    const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseAnonKey = (rawKey && !rawKey.includes('GRQzA5OhlSGqYuBMTO1kQg')) ? rawKey : 'sb_publishable_KIyib5jaW95brAa2OZne8Q_LVGhYlAV'

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
              redirectResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error && data?.user) {
        const user = data.user
        const perfil = user.user_metadata?.perfil
        if (perfil) {
          const salaResponse = NextResponse.redirect(`${origin}/sala?perfil=${perfil}`)
          redirectResponse.cookies.getAll().forEach(c => {
            salaResponse.cookies.set(c.name, c.value)
          })
          return salaResponse
        }
        return redirectResponse
      }
    } catch (err) {
      console.error('[Auth Callback] Erro no exchangeCodeForSession:', err)
    }
  }

  // Fallback suave: redireciona para onboarding para que o listener do cliente capture a sessão
  return NextResponse.redirect(`${origin}/onboarding`)
}
