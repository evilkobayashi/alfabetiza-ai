'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Escuta autenticação do Google OAuth e parâmetros de erro
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const perfil = session.user.user_metadata?.perfil || localStorage.getItem('alfabetiza_perfil')
        if (perfil) {
          router.replace(`/sala?perfil=${perfil}`)
        } else {
          router.replace('/onboarding')
        }
      }
    })

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('error')) {
        setMessage({ text: 'Não foi possível concluir a autenticação com Google. Tente novamente ou use seu e-mail.', type: 'error' })
      }
    }

    return () => subscription.unsubscribe()
  }, [router, supabase])

  async function handleGoogleSignIn() {
    setLoading(true)
    setMessage({ text: '', type: '' })
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      })
      if (error) {
        setMessage({ text: error.message, type: 'error' })
        setLoading(false)
      }
    } catch (err: any) {
      setMessage({ text: err?.message || 'Falha ao conectar ao serviço do Google.', type: 'error' })
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        // Checa fallback local caso Supabase esteja exigindo confirmação de e-mail
        const localUserStr = localStorage.getItem('alfabetiza_user')
        if (localUserStr) {
          try {
            const localUser = JSON.parse(localUserStr)
            if (localUser.email?.toLowerCase() === email.toLowerCase()) {
              const perfil = localUser.perfil || localStorage.getItem('alfabetiza_perfil') || 'KIDS'
              router.push(`/sala?perfil=${perfil}`)
              return
            }
          } catch {}
        }

        if (error.message.toLowerCase().includes('email not confirmed')) {
          setMessage({ text: 'E-mail pendente de confirmação. Acessando com sessão local...', type: 'warning' })
          setTimeout(() => {
            const perfil = localStorage.getItem('alfabetiza_perfil') || 'KIDS'
            router.push(`/sala?perfil=${perfil}`)
          }, 1200)
          return
        }

        setMessage({ text: error.message, type: 'error' })
        setLoading(false)
      } else {
        const perfil = data?.user?.user_metadata?.perfil || localStorage.getItem('alfabetiza_perfil') || 'KIDS'
        router.push(`/sala?perfil=${perfil}`)
      }
    } catch (err: any) {
      setMessage({ text: err?.message || 'Erro ao realizar login.', type: 'error' })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white font-sans text-gray-900">
      
      {/* LEFT */}
      <div className="hidden lg:flex lg:col-span-6 relative bg-gradient-to-br from-sky-900 via-teal-950 to-zinc-950 p-12 flex-col justify-between overflow-hidden border-r border-sky-900/50">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-white text-2xl tracking-tight">
            Alfabetiza <span className="text-sky-400">AÍ</span>
          </span>
        </div>

        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            Aprender a ler nunca foi tão natural.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Basta falar. A IA entende a sua voz e ensina letras, sílabas e palavras de forma personalizada.
          </p>
        </div>

        <div className="relative z-10 text-xs text-gray-400 pt-6 border-t border-white/10">
          © {new Date().getFullYear()} AÍ Tecnologia e Educação Ltda.
        </div>
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-12">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto my-auto py-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">Entrar</h1>
            <p className="text-sm text-gray-500 mt-2">Acesse sua sala de leitura personalizada.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
            <button onClick={handleGoogleSignIn} disabled={loading}
              className="w-full h-12 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold text-sm flex items-center justify-center gap-3 shadow-sm transition-all cursor-pointer mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continuar com Google
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="w-full border-t border-gray-200" />
              <span className="absolute bg-white px-3 text-xs text-gray-400 font-semibold uppercase">ou</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full pl-11 h-12 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-sky-500 text-sm font-medium outline-none" placeholder="seu@email.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider ml-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 h-12 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-sky-500 text-sm font-medium outline-none" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {message.text && (
                <p className={`text-sm text-center font-medium ${message.type === 'error' ? 'text-red-500' : 'text-sky-600'}`}>
                  {message.text}
                </p>
              )}
              <button type="submit" disabled={loading}
                className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-all">
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Não tem conta? <Link href="/signup" className="font-bold text-sky-600 hover:underline">Criar conta grátis</Link>
            </p>
          </div>
        </div>
        <div />
      </div>
    </div>
  )
}
