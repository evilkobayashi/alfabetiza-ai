'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Sparkles, Users, Accessibility, ArrowRight, BookOpen } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  
  const profiles = [
    {
      id: 'KIDS',
      title: 'Modo Criança',
      subtitle: '5 a 8 anos',
      icon: <Sparkles className="w-8 h-8 text-sky-500" />,
      color: 'border-sky-200 hover:border-sky-500 bg-sky-50',
      activeColor: 'border-sky-500 ring-2 ring-sky-500 bg-sky-100',
    },
    {
      id: 'EJA',
      title: 'Modo Adulto (EJA)',
      subtitle: 'Jovens e adultos',
      icon: <Users className="w-8 h-8 text-slate-700" />,
      color: 'border-slate-200 hover:border-slate-500 bg-slate-50',
      activeColor: 'border-slate-500 ring-2 ring-slate-500 bg-slate-200',
    },
    {
      id: 'PCD',
      title: 'Modo Inclusão',
      subtitle: 'TEA, TDAH, Dislexia',
      icon: <Accessibility className="w-8 h-8 text-teal-600" />,
      color: 'border-teal-200 hover:border-teal-500 bg-teal-50',
      activeColor: 'border-teal-500 ring-2 ring-teal-500 bg-teal-100',
    }
  ]

  async function handleFinish() {
    if (!selectedProfile) return
    setLoading(true)

    // 1. Persistência instantânea local e cookie
    try {
      localStorage.setItem('alfabetiza_perfil', selectedProfile)
      document.cookie = `alfabetiza_perfil=${selectedProfile}; path=/; max-age=31536000`
    } catch {}

    // 2. Persiste no PostgreSQL do Railway via API
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfil: selectedProfile }),
      })
    } catch (e) {
      console.warn('[Onboarding] Fallback ao gravar no banco:', e)
    }

    // 3. Atualiza metadata do usuário no Clerk se disponível
    try {
      if (user) {
        await user.update({
          unsafeMetadata: { perfil: selectedProfile }
        })
      }
    } catch {}

    // 4. Redireciona para a Sala de Leitura
    router.push('/sala?perfil=' + selectedProfile)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 text-center">
        
        <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-sky-600">
          <BookOpen className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-950 mb-3">Quem vai aprender a ler?</h1>
        <p className="text-gray-500 mb-8 text-sm">
          A IA vai adaptar o tom da voz, o ritmo e o visual para você.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {profiles.map((p) => {
            const isSelected = selectedProfile === p.id
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProfile(p.id)}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all cursor-pointer text-center relative overflow-hidden ${
                  isSelected ? p.activeColor : p.color
                }`}
              >
                <div className="mb-4">{p.icon}</div>
                <h3 className="font-bold text-gray-900 text-base mb-1">{p.title}</h3>
                <p className="text-xs text-gray-500 font-medium">{p.subtitle}</p>
              </button>
            )
          })}
        </div>

        <button
          disabled={!selectedProfile || loading}
          onClick={handleFinish}
          className="w-full py-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-base shadow-lg shadow-sky-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? 'Preparando sua sala...' : 'Começar a Aprender'}
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  )
}
