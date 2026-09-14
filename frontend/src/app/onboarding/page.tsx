'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Sparkles, Users, Accessibility, ArrowRight, BookOpen } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
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
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Create profile in DB
      await supabase
        .schema('alfabetiza_ai')
        .from('profiles')
        .upsert({
          id: user.id,
          perfil: selectedProfile
        })
    }
    
    // Redirect to app
    router.push('/sala?perfil=' + selectedProfile)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 text-center">
        
        <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-sky-600">
          <BookOpen className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-950 mb-3">Quem vai aprender a ler?</h1>
        <p className="text-gray-500 mb-10">Personalizamos a interface e a forma como a IA fala para adaptar à sua realidade.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProfile(p.id)}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${selectedProfile === p.id ? p.activeColor : p.color}`}
            >
              <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                {p.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{p.title}</h3>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{p.subtitle}</p>
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleFinish}
          disabled={!selectedProfile || loading}
          className="w-full sm:w-auto px-10 h-14 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg shadow-md transition-all flex items-center justify-center mx-auto gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Preparando Sala...' : 'Continuar'} <ArrowRight className="w-5 h-5" />
        </button>
        
      </div>
    </div>
  )
}
