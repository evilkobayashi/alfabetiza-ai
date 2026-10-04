'use client'

import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { BookOpen, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#FAF9F6] font-sans text-slate-800">
      {/* LEFT */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-blue-950 p-12 flex-col justify-between overflow-hidden">
        {/* Imagem de Fundo (Opcional, com overlay escuro) */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop" 
            alt="Fundo escola"
            className="w-full h-full object-cover grayscale"
          />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <BookOpen className="w-5 h-5 text-amber-500" />
          </div>
          <span className="font-serif text-white text-2xl font-bold tracking-tight">
            Alfabetiza<span className="text-amber-500">AÍ</span>
          </span>
        </div>

        <div className="relative z-10 space-y-6 my-auto max-w-sm">
          <h2 className="text-4xl font-serif font-bold text-white leading-tight">
            Bem-vindo à sala de aula do futuro.
          </h2>
          <p className="text-blue-100/80 text-base leading-relaxed font-medium">
            Acompanhe o desenvolvimento da leitura com a ajuda de uma inteligência artificial criada para o ritmo de cada criança.
          </p>
        </div>

        <div className="relative z-10 text-xs text-blue-200/50 pt-6">
          © {new Date().getFullYear()} AÍ Tecnologia e Educação.
        </div>
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar para o início
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto my-auto flex justify-center py-6">
          <SignIn
            routing="hash"
            forceRedirectUrl="/onboarding"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-2xl shadow-blue-900/5 border border-slate-200 rounded-3xl w-full",
                headerTitle: "font-serif text-2xl font-bold text-blue-950",
                headerSubtitle: "text-slate-500",
                socialButtonsBlockButton: "rounded-xl border-slate-200",
                formButtonPrimary: "bg-blue-900 hover:bg-blue-800 rounded-xl",
                footer: "hidden",
              }
            }}
          />
        </div>
        <div />
      </div>
    </div>
  )
}
